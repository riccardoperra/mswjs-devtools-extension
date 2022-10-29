import { StartOptions } from "msw";
import { DevtoolsRoute, SerializedMockConfig } from "./types";

export type MswDevtoolsEventData = {
  BRIDGE_CHECK_MSW: {
    detected: boolean;
  };
  BRIDGE_CHECK_MSW_RESPONSE: { ready: boolean };
  BRIDGE_MSW_START: { options: StartOptions | undefined };
  BRIDGE_MSW_STOP: void;
  BRIDGE_MSW_INIT: {
    handlers: DevtoolsRoute[];
    mocksConfig: SerializedMockConfig[];
    initialized: boolean;
  };
  BRIDGE_MSW_UPDATE_HANDLERS: { handlers: any[]; initialized: boolean };
  BRIDGE_MSW_UPDATE_MOCK_CONFIGURATION: { mocksConfig: SerializedMockConfig[] };

  DEVTOOLS_MSW_START: void;
  DEVTOOLS_MSW_STOP: void;
  DEVTOOLS_MOUNT: void;
  DEVTOOLS_UPDATE_ROUTE: { id: string; skip: boolean };
  DEVTOOLS_UPDATE_MOCK_CONFIGURATION: { id: string; skip: boolean };
  DEVTOOLS_DELETE_HANDLER: { id: string };

  DEVTOOLS_CREATE_HANDLER: DevtoolsRoute;
};
