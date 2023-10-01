import { DevtoolPanel } from "@mswjs-devtools/devtools";
import "@mswjs-devtools/devtools/dist/index.css";
import {
  createHandler,
  EnhancedDevtoolsRoute,
  generateUUID,
} from "@mswjs-devtools/shared";
import { RequestHandler } from "msw";
import { createStore } from "solid-js/store";
import { worker } from "./mocks/browser";
import { createEffect, createSignal, Show } from "solid-js";
import { LoadingPage } from "./components/LoadingPage/LoadingPage";

function buildSerializedRouteHandlers(
  handlers: readonly RequestHandler[],
): EnhancedDevtoolsRoute[] {
  return handlers.map((handler) => {
    return {
      id: generateUUID(),
      handlers: [
        {
          id: generateUUID(),
          response: "",
          delay: 0,
          status: 200,
          description: "MSW handler",
          origin: "msw",
        },
      ],
      url: (handler.info as any)["path"],
      method: (handler.info as any)["method"],
      skip: handler.shouldSkip,
      info: handler.info,
    };
  });
}

const [loading, setLoading] = createSignal(true);

worker.start().then((res) => setTimeout(() => setLoading(false), 500));

export function App() {
  const [enabled, setEnabled] = createSignal(true);
  const [routes, setRoutes] = createStore<EnhancedDevtoolsRoute[]>(
    buildSerializedRouteHandlers(worker.listHandlers()),
  );

  const serializedRoutes = () =>
    routes
      .map((route) => createHandler(route))
      .filter((route): route is NonNullable<typeof route> => !!route);

  createEffect(() => {
    JSON.parse(JSON.stringify(routes));
    worker.resetHandlers(...serializedRoutes());
  });

  return (
    <Show
      fallback={<LoadingPage />}
      when={!loading()}
      keyed={false}
    >
      <DevtoolPanel
        controller={{
          enabled: enabled(),
          mocks: [],
          routes,
          onEditHandler(id, data) {
            setRoutes(
              (route) => route.id === id,
              (route) => ({
                ...route,
                ...data,
              }),
            );
          },
          onCreateHandler(data) {
            const route: EnhancedDevtoolsRoute = {
              skip: false,
              ...data,
            };
            setRoutes((routes) => [...routes, route]);
          },
          setSkipMock(id: string, skip: boolean) {
            console.log("setSkipMock", id, skip);
          },
          setEnabled(enabled: boolean) {
            console.log("set enabled", enabled);
            setEnabled(enabled);
            if (!enabled) {
              worker.stop();
            } else {
              worker.start();
              worker.resetHandlers(...serializedRoutes());
            }
          },
          setSkipRoute(id: string, skip: boolean) {
            setRoutes((routes) =>
              routes.map((route) => {
                if (route.id === id) {
                  return { ...route, skip: !skip };
                }
                return route;
              }),
            );
          },
          forceReload() {
            console.log("force reload");
          },
          onDeleteHandler(id: string) {
            console.log("DELETE ROUTE", id);
            setRoutes((routes) => routes.filter((route) => route.id !== id));
          },
        }}
      />
    </Show>
  );
}
