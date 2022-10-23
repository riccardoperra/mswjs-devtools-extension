import {
  SerializedMockConfig,
  SerializedRouteHandler,
} from "../../shared/types";

export interface DevToolPanelController {
  enabled: boolean;
  routes: SerializedRouteHandler[];
  mocks: SerializedMockConfig[];

  setEnabled(enabled: boolean): void;

  setSkipRoute(id: number, skip: boolean): void;

  setSkipMock(id: string, skip: boolean): void;

  forceReload(): void;
}
