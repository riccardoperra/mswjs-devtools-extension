import { SerializedMockConfig, SerializedRouteHandler } from "../shared/types";
import { MswDevtoolsEventData } from "../shared/messages";

export interface DevToolPanelController {
  enabled: boolean;
  routes: SerializedRouteHandler[];
  mocks: SerializedMockConfig[];

  setEnabled(enabled: boolean): void;

  setSkipRoute(id: number, skip: boolean): void;

  setSkipMock(id: string, skip: boolean): void;

  forceReload(): void;

  onCreateHandler(data: MswDevtoolsEventData["DEVTOOLS_CREATE_HANDLER"]): void;
}
