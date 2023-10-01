import { type RequestHandler } from "msw";

export type MockConfig = Record<string, boolean>;

export interface SerializedMockConfig {
  id: string;
  label: string;
  skip: boolean;
}

export interface SerializedRouteHandler {
  id: number;
  info: RequestHandler["info"] & { method?: string; path?: string };
  skip: boolean;
}

export interface EnhancedDevtoolsRoute extends DevtoolsRoute {
  info?: RequestHandler["info"] & { method?: string; path?: string };
  skip: boolean;
  custom?: boolean;
}

export interface DevtoolsRoute {
  id: string;
  url: string;
  method: string;
  handlers: DevtoolsHandler[];
  selectedHandler?: string;
}

export interface DevtoolsHandler {
  id: string;
  response: string;
  status: number;
  delay: number | null;
  description: string;
  headers?: { key: string; value: string }[];
  readonly origin?: "msw" | "custom" | string;
}
