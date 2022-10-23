import { SetupWorkerApi } from "msw";

export function decorateMSW(msw: SetupWorkerApi) {
  const {
    start,
    use,
    stop,
    events,
    listHandlers,
    restoreHandlers,
    resetHandlers,
    printHandlers,
  } = msw;

  msw.start = function (options) {
    const delegate = start(options);

    return delegate;
  };

  msw.start = new Proxy(msw.start, {
    apply(
      target: (options?: StartOptions) => StartReturnType,
      thisArg: any,
      argArray: any[]
    ): any {},
  });
}
