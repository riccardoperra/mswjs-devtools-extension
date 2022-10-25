import { DevtoolPanel } from "@mswjs-devtools/devtools";
import "@mswjs-devtools/devtools/dist/index.css";

export function App() {
  return (
    <DevtoolPanel
      controller={{
        enabled: true,
        mocks: [
          { id: "1", label: "[GET]", skip: false },
          { id: "2", label: "[GET]", skip: false },
          { id: "3", label: "[GET]", skip: false },
          { id: "4", label: "[GET]", skip: false },
        ],
        routes: [
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
          {
            id: 1,
            skip: false,
            info: {
              method: "POST",
              path: "localhost",
              callFrame: "",
              header: "[GET]",
            },
          },
          {
            id: 2,
            skip: false,
            info: {
              method: "PUT",
              path: "localhost",
              callFrame: "",
              header: "[GET]",
            },
          },
        ],
        onCreateHandler(data) {
          console.log("onCreateHandler", data);
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
      }}
    />
  );
}
