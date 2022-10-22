import { RequestHandler, SetupWorkerApi } from "msw";
import { MswDevtoolsExtension } from "../shared/extension";

let handlerList: readonly RequestHandler[];

const __MSWJS_DEVTOOLS_EXTENSION: MswDevtoolsExtension = {
  msw: undefined,
  async configure(msw) {
    this.msw = msw;
    let initialized = false;
    const nativeMswStop = msw.stop;
    msw.stop = () => {
      initialized = false;
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
      initialized = true;
      const startReturn = nativeMswStart(options, ...args);
      window.postMessage(
        {
          source: "mswjs-script",
          type: "MSW_START",
        },
        "*"
      );
      return startReturn;
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
            init(msw, initialized);
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
                payload: {
                  handlers: updatedHandlers,
                  initialized: initialized,
                },
              },
              "*"
            );
          }
        }
      }
    });

    init(msw, initialized);
  },
};

Object.assign(window, { __MSWJS_DEVTOOLS_EXTENSION });

function init(msw: SetupWorkerApi, initialized: boolean) {
  handlerList = msw.listHandlers();
  const handlers = buildHandlers(handlerList);

  window.postMessage(
    {
      source: "mswjs-script",
      type: "MSW_INIT",
      payload: { handlers, initialized },
    },
    "*"
  );
}

function buildHandlers(handlers: readonly RequestHandler[]) {
  return handlers.map((handler, index) => {
    return {
      id: index,
      skip: handler.shouldSkip,
      info: handler.info,
    };
  });
}
