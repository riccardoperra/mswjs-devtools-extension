import { DevtoolPanel } from "@mswjs-devtools/devtools";
import "@mswjs-devtools/devtools/dist/index.css";
import { EnhancedDevtoolsRoute } from "@mswjs-devtools/shared";
import { createStore } from "solid-js/store";

function* createIncremental(): IterableIterator<number> {
  let count = 0;
  while (true) {
    yield ++count;
  }
}

const incremental = createIncremental();

export function App() {
  const [routes, setRoutes] = createStore<EnhancedDevtoolsRoute[]>([
    {
      id: 0,
      skip: false,
      selectedHandler: 0,
      url: "http://jsonplaceholder.com",
      method: "GET",
      custom: true,
      handlers: [
        {
          description: "Handler",
          status: 200,
          delay: 0,
          response: "{}",
        },
      ],
    },
    {
      id: 1,
      skip: false,
      selectedHandler: 0,
      url: "http://jsonplaceholder.com",
      method: "POST",
      handlers: [
        {
          description: "Handler",
          status: 200,
          delay: 0,
          response: "{}",
        },
      ],
    },
  ]);

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
        setSkipRoute(id: number, skip: boolean) {
          console.log("setSkipRoute", id, skip);
        },
        forceReload() {
          console.log("force reload");
        },
        onDeleteHandler(id: number) {
          console.log("DELETE ROUTE", id);
          setRoutes((routes) => routes.filter((route) => route.id !== id));
        },
      }}
    />
  );
}
