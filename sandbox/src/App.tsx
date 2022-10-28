import { DevtoolPanel } from "@mswjs-devtools/devtools";
import "@mswjs-devtools/devtools/dist/index.css";
import { EnhancedDevtoolsRoute } from "@mswjs-devtools/shared";
import { createStore } from "solid-js/store";

function* createIncremental() {
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
      info: {
        method: "GET",
        path: "localhost",
        callFrame: "",
        header: "[GET]",
      },
    },
  ]);

  return (
    <DevtoolPanel
      controller={{
        enabled: true,
        mocks: [],
        routes,
        onCreateHandler(data) {
          const route: EnhancedDevtoolsRoute = {
            id: incremental.next(),
            skip: false,
            ...data,
          };

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
