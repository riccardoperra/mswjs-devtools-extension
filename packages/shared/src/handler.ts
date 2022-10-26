import { DevtoolsHandler } from "./messages";
import { compose, context, RequestHandler, rest } from "msw";

type RestMethodHandler = typeof rest[keyof typeof rest];

export function createHandler(handler: DevtoolsHandler): RequestHandler | null {
  const { method, url, response, status, delay } = handler;

  const restHandler = resolveRestHandler(method);

  if (!restHandler) {
    return null;
  }

  const transformer = compose(
    delay ? context.delay(delay) : (source) => source,
    context.status(status),
    context.json(response)
  );

  return restHandler(url, (req, res, ctx) => {
    return res(transformer);
  });
}

function resolveRestHandler(key: string): RestMethodHandler | null {
  const restMethod: RestMethodHandler | undefined = Reflect.get(
    rest,
    key.toLowerCase()
  );
  return restMethod ?? null;
}
