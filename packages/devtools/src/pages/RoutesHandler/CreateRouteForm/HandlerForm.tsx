import { StatusCodes } from "../status";
import { ExclamationTriangleIcon } from "../../../components/ExclamationTriangleIcon";
import { CheckIcon } from "../../../components/CheckIcon";
import { getCreateRouteHandlerForm } from "./createHandlerForm";
import {
  createSignal,
  ErrorBoundary,
  For,
  lazy,
  Match,
  Show,
  Suspense,
  Switch,
} from "solid-js";

const JsonEditor = lazy(() =>
  import("../../../components/JsonEditor/JsonEditor").then((m) => ({
    default: m.JsonEditor,
  }))
);

export function HandlerForm() {
  const form = getCreateRouteHandlerForm();
  const [routeTab] = createSignal(0);

  return (
    <>
      <Switch>
        <Match when={routeTab() === 0}>
          <div class={"px-4 py-2 flex gap-2 bg-base-100 shadow"}>
            <div class="form-control flex-row items-center gap-2">
              <label class="label">
                <span class="label-text">Status</span>
              </label>
              <select
                class="select select-sm select-bordered w-[200px]"
                value={form.handler.status}
                onChange={(event) =>
                  form.setHandler(
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
                value={form.handler.description}
                onInput={(event) =>
                  form.setHandler("description", event.currentTarget.value)
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
                value={form.handler.delay ?? 0}
                onInput={(event) =>
                  form.setHandler(
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
                when={form.isValid}
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
                    value={form.handler.response}
                    onSave={form.formatJson}
                    onValueChange={(value) =>
                      form.setHandler("response", value)
                    }
                  />
                </div>
              </Suspense>
            </ErrorBoundary>
          </div>
        </Match>
      </Switch>
    </>
  );
}
