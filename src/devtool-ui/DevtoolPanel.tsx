import { ReloadIcon } from "../components/ReloadIcon";
import { createSignal, Match, Switch, VoidProps } from "solid-js";
import styles from "./DevtoolPanel.module.css";
import { DevToolPanelController } from "./controller";
import { MockConfigHandler } from "./pages/MockConfigHandler/MockConfigHandler";
import { RoutesHandler } from "./pages/RoutesHandler/RoutesHandler";

interface DevtoolPanel {
  controller: DevToolPanelController;
}

export function DevtoolPanel(props: VoidProps<DevtoolPanel>) {
  const [activeTab, setActiveTab] = createSignal(0);

  const getTabClasses = (index: number) => {
    return activeTab() === index ? `tab tab-active` : `tab`;
  };

  return (
    <div>
      <div
        class={`bg-base-300 flex items-center h-[46px] px-4 ${styles.Header}`}
      >
        <div class="flex items-center w-full">
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
          <div class="ml-auto">
            <button
              class={"btn btn-sm btn-ghost gap-2"}
              onClick={props.controller.forceReload}
            >
              <ReloadIcon />
              Reload
            </button>
          </div>
        </div>
      </div>

      <fieldset disabled={!props.controller.enabled}>
        <div>
          <div class="tabs tabs-boxed px-4">
            <a class={getTabClasses(0)} onClick={() => setActiveTab(0)}>
              Routes
            </a>
            <a class={getTabClasses(1)} onClick={() => setActiveTab(1)}>
              Mocks config
            </a>
            <a class={getTabClasses(2)} onClick={() => setActiveTab(2)}>
              Environment
            </a>
          </div>
        </div>

        <Switch>
          <Match when={activeTab() === 0} keyed={false}>
            <RoutesHandler
              routes={props.controller.routes}
              setSkipRoute={props.controller.setSkipRoute}
            />
          </Match>

          <Match when={activeTab() === 1} keyed={false}>
            <MockConfigHandler
              mocks={props.controller.mocks}
              setSkipMock={props.controller.setSkipMock}
            />
          </Match>
        </Switch>
      </fieldset>
    </div>
  );
}
