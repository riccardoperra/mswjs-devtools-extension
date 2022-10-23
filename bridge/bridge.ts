import { RequestHandler, SetupWorkerApi } from "msw";
import { MswDevtoolsExtension } from "../shared/extension";
import { logHandler } from "./logHandler";
import { bridgeMessenger } from "./bridgeMessenger";

let handlerList: readonly RequestHandler[];

const __MSWJS_DEVTOOLS_EXTENSION: MswDevtoolsExtension = {
  msw: undefined,
  async configure(msw, rest) {
    this.msw = msw;

    let initialized = false;
    const nativeMswStop = msw.stop;
    msw.stop = () => {
      initialized = false;
      nativeMswStop();
      bridgeMessenger.dispatch("BRIDGE_MSW_STOP", undefined, "content-script");
    };

    const nativeMswStart = msw.start;
    msw.start = (options, ...args) => {
      initialized = true;
      const startReturn = nativeMswStart(options, ...args);
      bridgeMessenger.dispatch(
        "BRIDGE_MSW_START",
        { options },
        "content-script"
      );
      return startReturn;
    };

    bridgeMessenger.on(
      "DEVTOOLS_MSW_START",
      () => msw.start(),
      "content-script"
    );

    bridgeMessenger.on("DEVTOOLS_MSW_STOP", () => msw.stop(), "content-script");

    bridgeMessenger.on(
      "DEVTOOLS_MOUNT",
      () => init(msw, initialized),
      "content-script"
    );

    bridgeMessenger.on(
      "DEVTOOLS_UPDATE_MOCK",
      ({ payload: { id, skip } }) => {
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
          logHandler(handler, {
            color: "#e3db2a",
            description: "Disabled",
          });
        } else {
          logHandler(handler, {
            color: "#34d537",
            description: "Enabled",
          });
        }

        const updatedHandlers = buildHandlers(handlerList);
        bridgeMessenger.dispatch("BRIDGE_MSW_UPDATE_HANDLERS", {
          handlers: updatedHandlers,
          initialized: initialized,
        });
      },
      "content-script"
    );

    init(msw, initialized);
  },
};

Object.assign(window, { __MSWJS_DEVTOOLS_EXTENSION });

function init(msw: SetupWorkerApi, initialized: boolean) {
  handlerList = msw.listHandlers();
  const handlers = buildHandlers(handlerList);
  bridgeMessenger.dispatch(
    "BRIDGE_MSW_INIT",
    {
      handlers,
      initialized,
    },
    "content-script"
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
