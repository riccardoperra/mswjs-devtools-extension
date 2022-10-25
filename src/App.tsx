import {
  Component,
  createSignal,
  lazy,
  onCleanup,
  onMount,
  Show,
  Suspense,
} from "solid-js";
import { version } from "../package.json";
import { devtoolsMessenger } from "./devtoolsMessenger";
import { NotDetected } from "./components/NotDetected";
import { LoadingPage } from "./components/LoadingPage/LoadingPage";
import { SerializedMockConfig, SerializedRouteHandler } from "../shared/types";
import { Footer } from "./Footer";
import * as styles from "./App.css";
import { MswDevtoolsEventData } from "../shared/messages";

const DevtoolPanel = lazy(() =>
  import("../frontend/DevtoolPanel").then((m) => ({
    default: m.DevtoolPanel,
  }))
);

const App: Component = () => {
  const devToolsVersion = version;
  const [loading, setLoading] = createSignal(true);
  const [detected, setDetected] = createSignal(false);
  const [enabled, setEnabled] = createSignal(false);
  const [handlers, setHandlers] = createSignal<SerializedRouteHandler[]>([]);

  const [mockConfigurations, setMockConfigurations] = createSignal<
    SerializedMockConfig[]
  >([]);

  onMount(() => {
    const subscriptions: (() => void)[] = [];

    subscriptions.push(
      devtoolsMessenger.on("BRIDGE_CHECK_MSW", ({ payload }) => {
        const { detected } = payload;
        setDetected(detected);
        setLoading(false);
      }),

      devtoolsMessenger.on(
        "BRIDGE_MSW_INIT",
        ({ payload }) => {
          const { handlers, initialized, mocksConfig } = payload;
          setHandlers(handlers);
          setMockConfigurations(mocksConfig);
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
        ({ payload }) => setMockConfigurations(payload.mocksConfig),
        "content-script"
      )
    );

    devtoolsMessenger.dispatch("DEVTOOLS_MOUNT", undefined, "content-script");

    onCleanup(() => subscriptions.forEach((unsubscribe) => unsubscribe()));
  });

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

  const reload = () => {
    setLoading(true);
    devtoolsMessenger.dispatch("DEVTOOLS_MOUNT", undefined);
  };

  const setSkipRoute = (id: number, skip: boolean) =>
    devtoolsMessenger.dispatch("DEVTOOLS_UPDATE_ROUTE", { id, skip });

  const setSkipMock = (id: string, skip: boolean) =>
    devtoolsMessenger.dispatch("DEVTOOLS_UPDATE_MOCK_CONFIGURATION", {
      id,
      skip,
    });

  const onCreateHandler = (
    data: MswDevtoolsEventData["DEVTOOLS_CREATE_HANDLER"]
  ) => {
    devtoolsMessenger.dispatch("DEVTOOLS_CREATE_HANDLER", data);
  };

  return (
    <div class={styles.container}>
      <Suspense fallback={<LoadingPage />}>
        <Show fallback={<LoadingPage />} when={!loading()} keyed={false}>
          <Show fallback={<NotDetected />} when={detected()} keyed={false}>
            <DevtoolPanel
              controller={{
                enabled: enabled(),
                mocks: mockConfigurations(),
                get routes() {
                  return handlers();
                },
                setSkipRoute(id: number, skip: boolean) {
                  setSkipRoute(id, skip);
                },
                setSkipMock(id: string, skip: boolean) {
                  setSkipMock(id, skip);
                },
                setEnabled(enabled: boolean) {
                  if (enabled) {
                    start();
                  } else {
                    stop();
                  }
                },
                forceReload() {
                  reload();
                },
                onCreateHandler,
              }}
            />
          </Show>
        </Show>
      </Suspense>
      <Footer version={devToolsVersion} />
    </div>
  );
};

export default App;
