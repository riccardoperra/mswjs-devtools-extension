import { DevtoolPanel } from "../../frontend/DevtoolPanel";
import { MswDevtoolsEventData } from "../../shared/messages";

export function App() {
  return (
    <DevtoolPanel
      controller={{
        enabled: true,
        mocks: [],
        routes: [],
        onCreateHandler(data: MswDevtoolsEventData["DEVTOOLS_CREATE_HANDLER"]) {
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
