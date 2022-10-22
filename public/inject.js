/**
 * @type {ReadonlyArray<import('msw').RequestHandler>}
 */
let handlerList;

window.__MSWJS_DEVTOOLS_EXTENSION = {
  msw: undefined,

  /**
   *
   * @param msw {import('msw').SetupWorkerApi}
   */
  async configure(msw) {
    this.msw = msw;

    const nativeMswStop = msw.stop;
    msw.stop = () => {
      nativeMswStop();
      window.postMessage(
        {
          source: "mswjs-script",
          type: "MSW_STOP",
        },
        "*"
      );
    };

    const nativeMswStart = msw.start;
    msw.start = (options, ...args) => {
      nativeMswStart(options, ...args);
      window.postMessage(
        {
          source: "mswjs-script",
          type: "MSW_START",
        },
        "*"
      );
    };

    window.addEventListener("message", (event) => {
      if (event.data && event.data.source === "mswjs-content") {
        switch (event.data.type) {
          case "MSW_START": {
            return msw.start();
          }
          case "MSW_STOP": {
            return msw.stop();
          }
          case "MSW_INIT": {
            init(msw);
            break;
          }
          case "MSW_MOCK_UPDATE": {
            const { id, skip } = event.data.payload;
            const handler = handlerList[id];

            if (handler) {
              handler.markAsSkipped(skip);
            }

            const {
              info: { callFrame, header },
            } = handler;

            const pragma = handler.info.hasOwnProperty("operationType")
              ? "[graphql]"
              : "[rest]";

            if (skip) {
              const message = `${pragma} ${header} disabled`;
              console.groupCollapsed(
                `%c${message}`,
                "color:orange;font-weight:bold;"
              );
              if (callFrame) {
                console.log(`Declaration: ${callFrame}`);
              }
              console.log("Handler:", handler);
              console.groupEnd();
            } else {
              const message = `${pragma} ${header} enabled`;
              console.groupCollapsed(
                `%c${message}`,
                "color:green;font-weight:bold;"
              );
              if (callFrame) {
                console.log(`Declaration: ${callFrame}`);
              }
              console.groupEnd();
            }

            const updatedHandlers = buildHandlers(handlerList);
            window.postMessage(
              {
                source: "mswjs-script",
                type: "MSW_UPDATE_HANDLERS",
                payload: { handlers: updatedHandlers },
              },
              "*"
            );
          }
        }
      }
    });

    init(msw);
  },
};

/**
 *
 * @param {import('msw').SetupWorkerApi} msw
 */
function init(msw) {
  handlerList = msw.listHandlers();
  const handlers = buildHandlers(handlerList);

  window.postMessage(
    {
      source: "mswjs-script",
      type: "MSW_INIT",
      payload: { handlers },
    },
    "*"
  );
}

/**
 *
 * @param {ReadonlyArray<import('msw').RestHandler>} handlers
 * @returns {*}
 */
function buildHandlers(handlers) {
  return handlers.map((handler, index) => {
    return {
      id: index,
      skip: handler.shouldSkip,
      info: handler.info,
    };
  });
}
