import { DevtoolsHandler, DevtoolsRoute } from "./types";
import { compose, context, RequestHandler, rest } from "msw";
import { faker } from "@faker-js/faker";

type RestMethodHandler = (typeof rest)[keyof typeof rest];

export function createHandler(handler: DevtoolsRoute): RequestHandler | null {
  const { method, url } = handler;

  const restHandler = resolveRestHandler(method);

  if (!restHandler) {
    return null;
  }

  return restHandler(url, (req, res, ctx) => {
    const { response, status, delay, headers } = resolveRouteHandler(handler);
    const resolvedHeaders = resolveCustomHeaders(headers);

    const jsonResponse = JSON.parse(response);

    traverseDeep(jsonResponse, (key, value) => {
      if (typeof value === "number") {
        return value;
      }
      // Handle faker.js helpers
      if (value.startsWith("faker.")) {
        return resolveFakerValue(key, value);
      }
      return value;
    });

    const transformer = compose(
      delay ? context.delay(delay) : (source) => source,
      resolvedHeaders ? context.set(resolvedHeaders) : (source) => source,
      context.status(status),
      context.json(jsonResponse),
    );

    return res(transformer);
  });
}

function resolveFakerValue(key: string, value: string): string | number {
  const fnSandbox = Function("faker", `return ${value}`);
  const result = fnSandbox.call(undefined, faker);
  return typeof result === "function" ? result.call() : result;
}

function resolveRestHandler(key: string): RestMethodHandler | null {
  const restMethod: RestMethodHandler | undefined = Reflect.get(
    rest,
    key.toLowerCase(),
  );
  return restMethod ?? null;
}

function resolveCustomHeaders(headers: DevtoolsHandler["headers"]) {
  if (!headers || headers.length === 0) return null;

  return headers.reduce(
    (acc, header) => {
      if (acc[header.key]) {
        acc[header.key] = coerceArray(acc[header.key]).concat(header.value);
      }
      acc[header.key] = header.value;
      return acc;
    },
    {} as Record<string, string | string[]>,
  );
}

function traverseDeep(
  json: Record<string, any>,
  walkFn: (key: string, value: string | number) => string | number,
) {
  const keys = Object.keys(json);
  for (const key of keys) {
    const value = json[key];

    if (Array.isArray(value)) {
      value.forEach((item) => traverseDeep(item, walkFn));
      return;
    }

    if (typeof value === "object") {
      traverseDeep(value, walkFn);
      return;
    }

    json[key] = walkFn(key, value);
  }
}

function resolveRouteHandler(route: DevtoolsRoute): DevtoolsHandler {
  return (
    route.handlers.find((handler) => handler.id === route.selectedHandler) ??
    route.handlers[0]
  );
}

function coerceArray<T>(data: T | T[]): T[] {
  return Array.isArray(data) ? data : [data];
}
