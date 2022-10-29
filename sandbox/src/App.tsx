import { DevtoolPanel } from "@mswjs-devtools/devtools";
import "@mswjs-devtools/devtools/dist/index.css";
import { EnhancedDevtoolsRoute, generateUUID } from "@mswjs-devtools/shared";
import { RequestHandler } from "msw";
import { createStore } from "solid-js/store";
import { worker } from "./mocks/browser";
import { api } from "./mocks/handlers";

function buildSerializedRouteHandlers(
  handlers: readonly RequestHandler[]
): EnhancedDevtoolsRoute[] {
  return handlers.map((handler) => {
    return {
      id: generateUUID(),
      handlers: [],
      url: (handler.info as any)["path"],
      method: (handler.info as any)["method"],
      skip: handler.shouldSkip,
      info: handler.info,
    };
  });
}

worker.start();

export function App() {
  const [routes, setRoutes] = createStore<EnhancedDevtoolsRoute[]>(
    buildSerializedRouteHandlers(worker.listHandlers())
  );

  setInterval(() => {
    fetch(api.fetchAllTodos).then((res) => res.json());
  }, 2000);

  return (
    <DevtoolPanel
      controller={{
        enabled: true,
        mocks: [],
        routes,
        onEditHandler(id, data) {
          console.log("onEditHandler", { ...data });
          setRoutes(
            (route) => route.id === id,
            (route) => ({
              ...route,
              ...data,
            })
          );
        },
        onCreateHandler(data) {
          const route: EnhancedDevtoolsRoute = {
            skip: false,
            ...data,
          };
          console.log("onCreateHandler", route);

          setRoutes((routes) => [...routes, route]);
        },
        setSkipMock(id: string, skip: boolean) {
          console.log("setSkipMock", id, skip);
        },
        setEnabled(enabled: boolean) {
          console.log("enabled", enabled);
        },
        setSkipRoute(id: string, skip: boolean) {
          console.log("setSkipRoute", id, skip);
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
  );
}
