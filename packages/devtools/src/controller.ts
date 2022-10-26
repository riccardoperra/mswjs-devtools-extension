import {
  DevtoolsHandler,
  SerializedMockConfig,
  SerializedRouteHandler,
} from "@mswjs-devtools/shared";

export interface DevToolPanelController {
  enabled: boolean;
  routes: SerializedRouteHandler[];
  mocks: SerializedMockConfig[];

  setEnabled(enabled: boolean): void;

  setSkipRoute(id: number, skip: boolean): void;

  setSkipMock(id: string, skip: boolean): void;

  forceReload(): void;

  onCreateHandler(data: DevtoolsHandler): void;

  onDeleteHandler(id: number): void;
}
