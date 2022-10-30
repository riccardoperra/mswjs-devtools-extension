import { ReloadIcon } from "./components/ReloadIcon";
import { createSignal, Match, Switch, VoidProps } from "solid-js";
import { DevToolPanelController } from "./controller";
import { MockConfigHandler } from "./pages/MockConfigHandler/MockConfigHandler";
import { RoutesHandler } from "./pages/RoutesHandler/RoutesHandler";
import * as styles from "./DevtoolPanel.css";
import "./ui/global.css";
import { Box } from "./components/Box/Box";
import { Button } from "./components/Button/Button";

interface DevtoolPanel {
  controller: DevToolPanelController;
}

export function DevtoolPanel(props: VoidProps<DevtoolPanel>) {
  const [activeTab, setActiveTab] = createSignal(0);

  const getTabClasses = (index: number) => {
    return activeTab() === index ? `tab tab-active` : `tab`;
  };

  return (
    <div class={styles.wrapper}>
      <div class={styles.header}>
        <Box
          display={"flex"}
          alignItems={"center"}
          width={"full"}
        >
          <div class="form-control">
            <label class="label cursor-pointer">
              <input
                type="checkbox"
                class="toggle"
                checked={props.controller.enabled}
                onChange={(evt) =>
                  props.controller.setEnabled(evt.currentTarget.checked)
                }
              />
              <span class="ml-4 label-text font-bold">
                Enable MockServiceWorker
              </span>
            </label>
          </div>
          <Box marginLeft={"auto"}>
            <Button
              size={"sm"}
              icon={<ReloadIcon />}
              onClick={props.controller.forceReload}
            >
              Reload
            </Button>
          </Box>
        </Box>
      </div>

      <div class={`tabs tabs-boxed px-4 ${styles.tabs}`}>
        <a
          class={getTabClasses(0)}
          onClick={() => setActiveTab(0)}
        >
          Routes
        </a>
        <a
          class={getTabClasses(1)}
          onClick={() => setActiveTab(1)}
        >
          Mocks config
        </a>
      </div>

      <div class={styles.content}>
        <fieldset disabled={!props.controller.enabled}>
          <Switch>
            <Match
              when={activeTab() === 0}
              keyed={false}
            >
              <RoutesHandler
                routes={props.controller.routes}
                createHandler={props.controller.onCreateHandler}
                editHandler={props.controller.onEditHandler}
                setSkipRoute={props.controller.setSkipRoute}
                onDeleteHandler={props.controller.onDeleteHandler}
              />
            </Match>

            <Match
              when={activeTab() === 1}
              keyed={false}
            >
              <MockConfigHandler
                mocks={props.controller.mocks}
                setSkipMock={props.controller.setSkipMock}
              />
            </Match>
          </Switch>
        </fieldset>
      </div>
    </div>
  );
}
