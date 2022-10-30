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
  readonly id: string;
  readonly url: string;
  readonly method: string;
  readonly handlers: readonly DevtoolsHandler[];
  readonly selectedHandler?: number;
}

export interface DevtoolsHandler {
  response: string;
  status: number;
  delay: number | null;
  description: string;
  headers?: { key: string; value: string }[];
  readonly origin?: "msw" | "custom" | string;
}
