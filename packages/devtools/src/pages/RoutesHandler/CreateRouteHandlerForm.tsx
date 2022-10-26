import { createStore } from "solid-js/store";
import {
  createEffect,
  createSignal,
  ErrorBoundary,
  For,
  lazy,
  Match,
  Show,
  Suspense,
  Switch,
} from "solid-js";
import { CheckIcon } from "../../components/CheckIcon";
import { ExclamationTriangleIcon } from "../../components/ExclamationTriangleIcon";
import { SparklesIcon } from "../../components/SparklesIcon";
import { format } from "prettier";
import parserBabel from "prettier/parser-babel";
import {
  DevtoolsHandler,
  SerializedRouteHandler,
} from "@mswjs-devtools/shared";
import { PlusIcon } from "../../components/PlusIcon";

import { StatusCodes } from "./status";
import { routeMethods } from "../../constants/method";

interface CreateRouteHandlerFormProps {
  initialValue?: SerializedRouteHandler;
  onClose: () => void;
  onCreate: (route: DevtoolsHandler) => void;
}

const JsonEditor = lazy(() =>
  import("../../components/JsonEditor/JsonEditor").then((m) => ({
    default: m.JsonEditor,
  }))
);

export function CreateRouteHandlerForm(props: CreateRouteHandlerFormProps) {
  const [routeTab] = createSignal(0);

  const [form, setForm] = createStore<DevtoolsHandler>({
    method: routeMethods[0],
    url: "",
    response: "{}",
    status: 200,
    delay: 0,
    description: "",
  });

  createEffect(() => {
    if (props.initialValue) {
      setForm({
        method: props.initialValue.info.method,
        url: props.initialValue.info.path,
        response: "",
      });
    }
  });

  createEffect(() => console.log(JSON.stringify(form)));

  const responseIsValid = () => {
    const response = form.response;
    try {
      JSON.parse(response);
      return true;
    } catch (e) {
      return false;
    }
  };

  const isValid = () =>
    form.method && form.url && form.response && responseIsValid();

  const formatJson = () => {
    const formattedResponse = format(form.response, {
      tabWidth: 2,
      printWidth: 100,
      parser: "json",
      plugins: [parserBabel],
    });
    setForm("response", formattedResponse);
  };

  function onSubmit(): void {
    try {
      const response = JSON.parse(form.response);
      props.onCreate({
        response,
        url: form.url,
        method: form.method,
        delay: form.delay,
        status: form.status,
        description: form.description,
      });
      props.onClose();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div
      class={
        "w-[100%] h-[100%] absolute bg-base-200 w-full bottom-0 right-0 flex flex-col"
      }
    >
      <div class="px-4 py-2 flex items-center justify-between shadow-lg border-t border-base-300">
        <h1 class="text-lg font-bold">Create route</h1>
        <button
          class="btn btn-circle btn-sm btn-ghost"
          onClick={props.onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div class={"mt-2 px-4"}>
        <div class={"flex gap-2"}>
          <div class="form-control">
            <div class="input-group">
              <select
                class="select select-sm select-bordered"
                value={form.method}
                onInput={(event) =>
                  setForm("method", event.currentTarget.value)
                }
              >
                <For each={routeMethods}>
                  {(method) => {
                    const selected = () => method === form.method;
                    return (
                      <option
                        selected={selected()}
                        aria-selected={selected()}
                      >
                        {method}
                      </option>
                    );
                  }}
                </For>
              </select>
              <input
                type="text"
                placeholder="Type URL"
                class="input input-bordered input-sm w-full max-w-xs"
                onInput={(event) => setForm("url", event.currentTarget.value)}
              />
            </div>
          </div>

          <div class={"ml-auto flex gap-2"}>
            <button
              class={"btn btn-sm gap-2"}
              onClick={() => formatJson()}
            >
              <SparklesIcon />
              Format
            </button>
            <button
              class={"btn btn-primary btn-sm gap-2"}
              disabled={!isValid()}
              onClick={onSubmit}
            >
              <CheckIcon />
              Submit
            </button>
          </div>
        </div>
      </div>
      <div
        class={
          "mt-2 px-4 py-2 border-y border-opacity-20 border-base-content flex items-center gap-2 bg-base-100"
        }
      >
        <button class={"btn btn-primary btn-square btn-sm gap-2"}>
          <PlusIcon />
        </button>

        <div class="form-control w-full">
          <select class="select select-sm select-bordered">
            <option selected>
              Default response ({form.status}) -{" "}
              {form.description || "No description"}
            </option>
          </select>
        </div>
      </div>
      <Switch>
        <Match when={routeTab() === 0}>
          <div class={"px-4 py-2 flex gap-2 bg-base-100 shadow"}>
            <div class="form-control flex-row items-center gap-2">
              <label class="label">
                <span class="label-text">Status</span>
              </label>
              <select
                class="select select-sm select-bordered w-[200px]"
                value={form.status}
                onChange={(event) =>
                  setForm(
                    "status",
                    () => event.currentTarget.value as unknown as number
                  )
                }
              >
                <For each={StatusCodes}>
                  {(status) => (
                    <option
                      label={status.label}
                      value={status.value}
                    >
                      {status.label}
                    </option>
                  )}
                </For>
              </select>
            </div>

            <div class="form-control flex-row items-center gap-2">
              <label class="label">
                <span class="label-text">Description</span>
              </label>
              <input
                type="text"
                placeholder="Description"
                class="input input-sm input-bordered w-full max-w-xs"
                value={form.description}
                onInput={(event) =>
                  setForm("description", event.currentTarget.value)
                }
              />
            </div>

            <div class="form-control flex-row items-center gap-2">
              <label class="label">
                <span class="label-text">Delay (ms)</span>
              </label>
              <input
                type="number"
                placeholder="ms"
                value={form.delay ?? 0}
                onInput={(event) =>
                  setForm(
                    "delay",
                    event.currentTarget.value
                      ? parseInt(event.currentTarget.value, 10)
                      : null
                  )
                }
                class="input input-sm input-bordered w-[100px]"
              />
            </div>
          </div>

          <div
            class={
              "px-4 border-y border-opacity-20 border-base-content flex items-center"
            }
          >
            <label class="label">
              <span class="label-text">Response body</span>
            </label>
            <div class={"ml-auto"}>
              <Show
                fallback={
                  <span class={"text-yellow-500"}>
                    <ExclamationTriangleIcon />
                  </span>
                }
                when={responseIsValid()}
                keyed={false}
              >
                <span class={"text-green-500"}>
                  <CheckIcon />
                </span>
              </Show>
            </div>
          </div>
          <div class={"d-flex h-full relative"}>
            <ErrorBoundary fallback={(e) => <div>{e}</div>}>
              <Suspense>
                <div class={"absolute w-full h-full"}>
                  <JsonEditor
                    value={form.response}
                    onSave={formatJson}
                    onValueChange={(value) => setForm("response", value)}
                  />
                </div>
              </Suspense>
            </ErrorBoundary>
          </div>
        </Match>
      </Switch>
    </div>
  );
}
