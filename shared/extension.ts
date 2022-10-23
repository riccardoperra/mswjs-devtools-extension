import { type rest, RestHandler, SetupWorkerApi } from "msw";

export interface MswDevtoolsExtension {
  msw: SetupWorkerApi | undefined;

  configure(msw: SetupWorkerApi, mocks: Record<string, boolean>): Promise<void>;
}
