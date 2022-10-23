import { RequestHandler, SetupWorkerApi } from "msw";
import { MswDevtoolsExtension } from "../shared/extension";
import { logHandler } from "./logHandler";
import { bridgeMessenger } from "./bridgeMessenger";
import { logMock } from "./logMock";

let handlerList: readonly RequestHandler[];

const __MSWJS_DEVTOOLS_EXTENSION: MswDevtoolsExtension = {
  msw: undefined,
  async configure(msw, mocks) {
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
      () => init(msw, initialized, mocks),
      "content-script"
    );

    bridgeMessenger.on(
      "DEVTOOLS_UPDATE_ROUTE",
      ({ payload: { id, skip } }) => {
        const handler = handlerList[id];

        if (handler) {
          handler.markAsSkipped(skip);
        }

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

    bridgeMessenger.on(
      "DEVTOOLS_UPDATE_MOCK_CONFIGURATION",
      ({ payload: { id, skip } }) => {
        mocks[id] = !skip;
        if (skip) {
          logMock(id, {
            color: "#e3db2a",
            description: "Disabled",
          });
        } else {
          logMock(id, {
            color: "#34d537",
            description: "Enabled",
          });
        }

        bridgeMessenger.dispatch("BRIDGE_MSW_UPDATE_MOCK_CONFIGURATION", {
          mocks: mocks,
        });
      },
      "content-script"
    );

    init(msw, initialized, mocks);
  },
};

Object.assign(window, { __MSWJS_DEVTOOLS_EXTENSION });

function init(
  msw: SetupWorkerApi,
  initialized: boolean,
  mocks: Record<string, boolean>
) {
  handlerList = msw.listHandlers();
  const handlers = buildHandlers(handlerList);
  bridgeMessenger.dispatch(
    "BRIDGE_MSW_INIT",
    {
      handlers,
      initialized,
      mocks,
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
