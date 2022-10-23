import { type rest, RestHandler, SetupWorkerApi } from "msw";

export interface MswDevtoolsExtension {
  msw: SetupWorkerApi | undefined;

  configure(msw: SetupWorkerApi, restHandler: typeof rest): Promise<void>;
}
