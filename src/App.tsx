import { Component, createSignal, For, onMount } from "solid-js";
import styles from "./App.module.css";
import type { SetupWorkerApi } from "msw";

declare global {
  interface Window {
    __MSWJS_DEVTOOLS_EXTENSION: {
      msw: SetupWorkerApi;
    };
  }
}

function sendContent<T>(data: T) {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id as number, data);
    }
  );
}

interface Handler {
  info: any;
  id: number;
  skip: boolean;
}

const App: Component = () => {
  const [enabled, setEnabled] = createSignal(false);
  const [handlers, setHandlers] = createSignal<Handler[]>([]);

  onMount(() => sendContent({ type: "MSW_INIT", source: "mswjs-app" }));

  chrome.runtime.onMessage.addListener((message) => {
    if (message.source === "mswjs-script") {
      switch (message.type) {
        case "MSW_INIT": {
          const { handlers } = message.payload;
          setHandlers(handlers);
          break;
        }
        case "MSW_START": {
          setEnabled(true);
          break;
        }
        case "MSW_STOP": {
          setEnabled(false);
          break;
        }
        case "MSW_UPDATE_HANDLERS": {
          const { handlers } = message.payload;
          setHandlers(handlers);
        }
      }
    }
  });

  const stop = () => sendContent({ type: "MSW_STOP", source: "mswjs-app" });

  const start = () => sendContent({ type: "MSW_START", source: "mswjs-app" });

  const toggleSkipMock = (id: number, skip: boolean) =>
    sendContent({
      type: "MSW_MOCK_UPDATE",
      source: "mswjs-app",
      payload: { id, skip },
    });

  return (
    <div class={styles.App}>
      <div class="bg-base-300 flex items-center h-[46px] px-4">
        <div class="w-3/6">
          <div class="form-control">
            <label class="label cursor-pointer">
              <span class="label-text font-bold">Enable MockServiceWorker</span>
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
            </label>
          </div>
        </div>
      </div>

      <fieldset disabled={!enabled()}>
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
                        class="checkbox"
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
    </div>
  );
};

export default App;
