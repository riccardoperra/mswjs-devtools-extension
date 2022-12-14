import { RequestHandler, SetupWorkerApi } from "msw";
import { MswDevtoolsExtension } from "../shared/extension";
import { logHandler } from "./logHandler";
import { bridgeMessenger } from "./bridgeMessenger";
import { logMock } from "./logMock";
import { MockConfig } from "../shared/types";
import { toTitleCase } from "../shared/toTitleCase";
import {
  createHandler,
  EnhancedDevtoolsRoute,
  generateUUID,
} from "@mswjs-devtools/shared";

let handlerList: readonly RequestHandler[];

const __MSWJS_DEVTOOLS_EXTENSION: MswDevtoolsExtension = {
  msw: undefined,
  detected: undefined,
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

    const nativeMswUse = msw.use;
    msw.use = (...args) => {
      nativeMswUse(...args);
      init(msw, true, mocks);
    };

    bridgeMessenger.on(
      "DEVTOOLS_MSW_START",
      () => msw.start(),
      "content-script"
    );

    bridgeMessenger.on("DEVTOOLS_MSW_STOP", () => msw.stop(), "content-script");

    bridgeMessenger.on(
      "DEVTOOLS_MOUNT",
      () => {
        setTimeout(
          () => {
            const detected = !!__MSWJS_DEVTOOLS_EXTENSION.msw;
            this.detected = detected;
            bridgeMessenger.dispatch("BRIDGE_CHECK_MSW", { detected });
            if (detected) {
              init(msw, initialized, mocks);
            }
          },

          1000
        );
      },
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

        const updatedHandlers = buildSerializedRouteHandlers(handlerList);
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
          mocksConfig: buildSerializedMockConfigs(mocks),
        });
      },
      "content-script"
    );

    bridgeMessenger.on("DEVTOOLS_CREATE_HANDLER", ({ payload }) => {
      const resolver = createHandler(payload);
      if (!resolver) {
        return;
      }
      msw.use(resolver);
    });

    bridgeMessenger.on("DEVTOOLS_UPDATE_ROUTE", ({ payload }) => {});

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
  bridgeMessenger.dispatch(
    "BRIDGE_MSW_INIT",
    {
      handlers: buildSerializedRouteHandlers(handlerList),
      mocksConfig: buildSerializedMockConfigs(mocks),
      initialized,
    },
    "content-script"
  );
}

function buildSerializedRouteHandlers(
  handlers: readonly RequestHandler[]
): EnhancedDevtoolsRoute[] {
  return handlers.map((handler) => {
    return {
      id: generateUUID(),
      handlers: [],
      url: (handler.info as any)["path"],
      method: (handler.info as any)["method"],
      skip: handler.shouldSkip,
      info: handler.info,
    };
  });
}

function buildSerializedMockConfigs(config: MockConfig) {
  return Object.entries(config).map(([id, enabled]) => ({
    id: id,
    label: toTitleCase(id),
    skip: !enabled,
  }));
}

export {};
