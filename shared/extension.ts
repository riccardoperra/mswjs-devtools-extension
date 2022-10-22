import { SetupWorkerApi } from "msw";

export interface MswDevtoolsExtension {
  msw: SetupWorkerApi | undefined;

  configure(msw: SetupWorkerApi): Promise<void>;
}
