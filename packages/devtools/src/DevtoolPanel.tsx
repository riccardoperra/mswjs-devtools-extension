import { ReloadIcon } from "./components/ReloadIcon";
import { createEffect, createSignal, Match, Switch, VoidProps } from "solid-js";
import { DevToolPanelController } from "./controller";
import { MockConfigHandler } from "./pages/MockConfigHandler/MockConfigHandler";
import { RoutesHandler } from "./pages/RoutesHandler/RoutesHandler";
import * as styles from "./DevtoolPanel.css";
import "./ui/global.css";
import { Box } from "./components/Box/Box";
import { Button, Checkbox } from "@codeui/kit";

interface DevtoolPanel {
  controller: DevToolPanelController;
}

export function DevtoolPanel(props: VoidProps<DevtoolPanel>) {
  const [activeTab, setActiveTab] = createSignal(0);

  const getTabClasses = (index: number) => {
    return activeTab() === index ? `tab tab-active` : `tab`;
  };

  createEffect(() => console.log(props.controller.routes));

  document.body.setAttribute("data-cui-theme", "dark");

  return (
    <div class={`${styles.wrapper} bg-neutral-950`}>
      <div class={styles.header}>
        <Box
          display={"flex"}
          alignItems={"center"}
          width={"full"}
        >
          <div class="flex flex-row items-center">
            {/* TODO: add codeui switch */}
            <Checkbox
              checked={props.controller.enabled}
              onChange={(checked) => {
                props.controller.setEnabled(checked);
              }}
            />
            <span class="ml-1 text-md font-bold select-none">
              Enable MockServiceWorker
            </span>
          </div>
          <Box marginLeft={"auto"}>
            <Button
              size={"sm"}
              theme={"primary"}
              leftIcon={<ReloadIcon />}
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
