import { RequestHandler, RestHandler } from "msw";

interface LogHandlerOptions {
  color: string;
  description: string;
}

export function logHandler(
  handler: RequestHandler,
  options: LogHandlerOptions
) {
  const { header } = handler.info;

  const pragma = handler.info.hasOwnProperty("operationType")
    ? "[graphql]"
    : "[rest]";

  console.groupCollapsed(
    `%c${pragma} ${header} ${options.description}`,
    "color:orange;font-weight:bold;"
  );

  if (handler.info.callFrame) {
    console.log(`Declaration: ${handler.info.callFrame}`);
  }
  console.log("Handler:", handler);
  if (handler instanceof RestHandler) {
    console.log("Match:", `https://mswjs.io/repl?path=${handler.info.path}`);
  }
  console.groupEnd();
}
