import { Component, createSignal, For, onCleanup, onMount } from "solid-js";
import styles from "./App.module.css";
import { version } from "../package.json";
import { Footer } from "./Footer";
import { devtoolsMessenger } from "./devtoolsMessenger";

interface Handler {
  info: any;
  id: number;
  skip: boolean;
}

const App: Component = () => {
  const subscriptions: (() => void)[] = [];
  const devToolsVersion = version;
  const [enabled, setEnabled] = createSignal(false);
  const [handlers, setHandlers] = createSignal<Handler[]>([]);

  onMount(() =>
    devtoolsMessenger.dispatch("DEVTOOLS_MOUNT", undefined, "content-script")
  );

  onCleanup(() => subscriptions.forEach((unsubscribe) => unsubscribe()));

  subscriptions.push(
    devtoolsMessenger.on(
      "BRIDGE_MSW_INIT",
      ({ payload }) => {
        const { handlers, initialized } = payload;
        setHandlers(handlers);
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

  const toggleSkipMock = (id: number, skip: boolean) =>
    devtoolsMessenger.dispatch("DEVTOOLS_UPDATE_MOCK", { id, skip });

  onCleanup(() => {});

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
        <div class="px-4 my-3 flex items-center justify-between">
          <h1 class="text-lg font-bold">Available routes</h1>

          {/*<button class="btn btn-primary btn-sm">Add new</button>*/}
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
                          toggleSkipMock(
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
      </fieldset>

      <Footer version={version} />
    </div>
  );
};

export default App;
