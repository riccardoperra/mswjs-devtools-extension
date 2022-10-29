import { RequestHandler } from "msw";

export interface SerializedRouteHandler {
  id: string;
  info: RequestHandler["info"] & { method?: string; path?: string };
  skip: boolean;
}

export type MockConfig = Record<string, boolean>;

export interface SerializedMockConfig {
  id: string;
  label: string;
  skip: boolean;
}
