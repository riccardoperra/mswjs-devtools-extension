import { StartOptions } from "msw";
import { SerializedMockConfig, SerializedRouteHandler } from "./types";

export interface DevtoolsHandler {
  method: string;
  url: string;
  response: string;
  status: number;
  delay: number | null;
  description: string;
}

export type MswDevtoolsEventData = {
  BRIDGE_CHECK_MSW: {
    detected: boolean;
  };
  BRIDGE_CHECK_MSW_RESPONSE: { ready: boolean };
  BRIDGE_MSW_START: { options: StartOptions | undefined };
  BRIDGE_MSW_STOP: void;
  BRIDGE_MSW_INIT: {
    handlers: SerializedRouteHandler[];
    mocksConfig: SerializedMockConfig[];
    initialized: boolean;
  };
  BRIDGE_MSW_UPDATE_HANDLERS: { handlers: any[]; initialized: boolean };
  BRIDGE_MSW_UPDATE_MOCK_CONFIGURATION: { mocksConfig: SerializedMockConfig[] };

  DEVTOOLS_MSW_START: void;
  DEVTOOLS_MSW_STOP: void;
  DEVTOOLS_MOUNT: void;
  DEVTOOLS_UPDATE_ROUTE: { id: number; skip: boolean };
  DEVTOOLS_UPDATE_MOCK_CONFIGURATION: { id: string; skip: boolean };

  DEVTOOLS_CREATE_HANDLER: DevtoolsHandler;
};
