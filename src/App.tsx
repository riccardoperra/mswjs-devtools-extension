import {
  Component,
  createSignal,
  For,
  Match,
  onCleanup,
  onMount,
  Switch,
} from "solid-js";
import styles from "./App.module.css";
import { version } from "../package.json";
import { Footer } from "./Footer";
import { devtoolsMessenger } from "./devtoolsMessenger";

interface Handler {
  info: any;
  id: number;
  skip: boolean;
}

interface MockConfiguration {
  id: string;
  label: string;
  skip: boolean;
}

const titleCase = (s: string) =>
  s
    .replace(/(^|[_-])([a-z])/g, (a, b, c) => c.toUpperCase())
    .replace(/([a-z])([A-Z])/g, (a, b, c) => `${b} ${c}`);

const App: Component = () => {
  const subscriptions: (() => void)[] = [];
  const devToolsVersion = version;
  const [enabled, setEnabled] = createSignal(false);
  const [handlers, setHandlers] = createSignal<Handler[]>([]);

  const [mockConfigurations, setMockConfigurations] = createSignal<
    MockConfiguration[]
  >([]);

  const [activeTab, setActiveTab] = createSignal(1);

  onMount(() =>
    devtoolsMessenger.dispatch("DEVTOOLS_MOUNT", undefined, "content-script")
  );

  onCleanup(() => subscriptions.forEach((unsubscribe) => unsubscribe()));

  subscriptions.push(
    devtoolsMessenger.on(
      "BRIDGE_MSW_INIT",
      ({ payload }) => {
        const { handlers, initialized, mocks } = payload;

        const mocksArray = Object.entries(mocks).map(([k, v]) => ({
          id: k,
          label: titleCase(k),
          skip: !v,
        }));

        setHandlers(handlers);
        setMockConfigurations(mocksArray);
        if (initialized) {
          setEnabled(initialized);
        }
      },
      "content-script"
    ),
    devtoolsMessenger.on(
      "BRIDGE_MSW_START",
      () => setEnabled(true),
      "content-script"
    ),
    devtoolsMessenger.on(
      "BRIDGE_MSW_STOP",
      () => setEnabled(false),
      "content-script"
    ),
    devtoolsMessenger.on(
      "BRIDGE_MSW_UPDATE_HANDLERS",
      ({ payload }) => {
        const { handlers } = payload;
        setHandlers(handlers);
      },
      "content-script"
    ),
    devtoolsMessenger.on(
      "BRIDGE_MSW_UPDATE_MOCK_CONFIGURATION",
      ({ payload }) => {
        const { mocks } = payload;

        const mocksArray = Object.entries(mocks).map(([k, v]) => ({
          id: k,
          label: titleCase(k),
          skip: !v,
        }));

        setMockConfigurations(mocksArray);
      },
      "content-script"
    )
  );

  const stop = () =>
    devtoolsMessenger.dispatch(
      "DEVTOOLS_MSW_STOP",
      undefined,
      "content-script"
    );

  const start = () => {
    devtoolsMessenger.dispatch(
      "DEVTOOLS_MSW_START",
      undefined,
      "content-script"
    );
  };

  const toggleSkipRoute = (id: number, skip: boolean) =>
    devtoolsMessenger.dispatch("DEVTOOLS_UPDATE_ROUTE", { id, skip });

  const toggleSkipMock = (id: string, skip: boolean) =>
    devtoolsMessenger.dispatch("DEVTOOLS_UPDATE_MOCK_CONFIGURATION", {
      id,
      skip,
    });

  const getTabClasses = (index: number) =>
    activeTab() === index ? `tab tab-active` : `tab`;

  return (
    <div class={styles.App}>
      <div
        class={`bg-base-300 flex items-center h-[46px] px-4 ${styles.Header}`}
      >
        <div class="flex">
          <div class="form-control">
            <label class="label cursor-pointer">
              <input
                type="checkbox"
                class="toggle"
                checked={enabled()}
                onChange={(evt) => {
                  if (evt.currentTarget.checked) {
                    start();
                  } else {
                    stop();
                  }
                }}
              />
              <span class="ml-4 label-text font-bold">
                Enable MockServiceWorker
              </span>
            </label>
          </div>
        </div>
      </div>

      <fieldset disabled={!enabled()}>
        <div class="px-3 my-3">
          <div class="tabs tabs-boxed">
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
            <div class="px-4 my-3 flex items-center justify-between">
              <h1 class="text-lg font-bold">Available routes</h1>
              <button class="btn btn-primary btn-sm">Add new</button>
            </div>
            <div class={styles.HandlersList}>
              <For each={handlers()}>
                {(handler) => {
                  return (
                    <div class={"py-2 flex items-center"}>
                      <div class="form-control">
                        <label class="label cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!handler.skip}
                            classList={{
                              checkbox: true,
                              "checkbox-primary": !handler.skip,
                            }}
                            onChange={(event) =>
                              toggleSkipRoute(
                                handler.id,
                                !event.currentTarget.checked
                              )
                            }
                          />
                          <span class="label-text ml-4">
                            [{handler.info.method}] {handler.info.path}
                          </span>
                        </label>
                      </div>
                    </div>
                  );
                }}
              </For>
            </div>
          </Match>

          <Match when={activeTab() === 1} keyed={false}>
            <div class="px-4 my-3 flex items-center justify-between">
              <h1 class="text-lg font-bold">Mocks config</h1>
            </div>
            <div class={styles.HandlersList}>
              <For each={mockConfigurations()}>
                {(mock) => {
                  return (
                    <div class={"py-2 flex items-center"}>
                      <div class="form-control">
                        <label class="label cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!mock.skip}
                            classList={{
                              checkbox: true,
                              "checkbox-primary": !mock.skip,
                            }}
                            onChange={(event) =>
                              toggleSkipMock(
                                mock.id,
                                !event.currentTarget.checked
                              )
                            }
                          />
                          <span class="label-text ml-4 normal-case">
                            {mock.label}
                          </span>
                        </label>
                      </div>
                    </div>
                  );
                }}
              </For>
            </div>
          </Match>
        </Switch>
      </fieldset>

      <Footer version={version} />
    </div>
  );
};

export default App;
