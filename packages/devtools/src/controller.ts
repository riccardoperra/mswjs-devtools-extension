import {
  DevtoolsRoute,
  EnhancedDevtoolsRoute,
  SerializedMockConfig,
} from "@mswjs-devtools/shared";

export interface DevToolPanelController {
  enabled: boolean;
  routes: EnhancedDevtoolsRoute[];
  mocks: SerializedMockConfig[];

  setEnabled(enabled: boolean): void;

  setSkipRoute(id: string, skip: boolean): void;

  setSkipMock(id: string, skip: boolean): void;

  forceReload(): void;

  onCreateHandler(data: DevtoolsRoute): void;

  onEditHandler(id: string, data: DevtoolsRoute): void;

  onDeleteHandler(id: string): void;
}
