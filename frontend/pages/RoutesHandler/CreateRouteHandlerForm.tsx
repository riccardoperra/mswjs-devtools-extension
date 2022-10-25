import { createStore } from "solid-js/store";
import {
  createEffect,
  ErrorBoundary,
  For,
  lazy,
  Show,
  Suspense,
} from "solid-js";
import { CheckIcon } from "../../components/CheckIcon";
import { ExclamationTriangleIcon } from "../../components/ExclamationTriangleIcon";
import { SparklesIcon } from "../../components/SparklesIcon";
import { format } from "prettier";
import parserBabel from "prettier/parser-babel";

const METHODS = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "HEAD",
  "OPTION",
  "ALL",
] as const;

interface CreateRouteHandlerFormProps {
  onClose: () => void;
  onCreate: (a: any) => void;
}

const JsonEditor = lazy(() =>
  import("../../components/JsonEditor/JsonEditor").then((m) => ({
    default: m.JsonEditor,
  }))
);

export function CreateRouteHandlerForm(props: CreateRouteHandlerFormProps) {
  const [form, setForm] = createStore({
    method: METHODS[0] as string,
    url: "",
    response: "{}",
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

  return (
    <div
      class={
        "w-[100%] h-[100%] absolute bg-base-300 w-full bottom-0 right-0 flex flex-col"
      }
    >
      <div class="px-4 py-2 flex items-center justify-between shadow-lg border-t border-base-300">
        <h1 class="text-lg font-bold">Create route</h1>
        <button class="btn btn-circle btn-sm btn-ghost" onClick={props.onClose}>
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
                class="select select-bordered"
                value={form.method}
                onInput={(event) =>
                  setForm("method", event.currentTarget.value)
                }
              >
                <For each={METHODS}>
                  {(method) => {
                    const selected = () => method === form.method;
                    return (
                      <option selected={selected()} aria-selected={selected()}>
                        {method}
                      </option>
                    );
                  }}
                </For>
              </select>
              <input
                type="text"
                placeholder="Type URL"
                class="input input-bordered w-full max-w-xs"
                onInput={(event) => setForm("url", event.currentTarget.value)}
              />
            </div>
          </div>

          <div class={"ml-auto flex gap-2"}>
            <button
              class={"btn btn-primary gap-2"}
              onClick={() => formatJson()}
            >
              <SparklesIcon />
              Format
            </button>
            <button
              class={"btn btn-primary gap-2"}
              disabled={!isValid()}
              onClick={() => {
                try {
                  const response = JSON.parse(form.response);
                  props.onCreate({
                    response,
                    url: form.url,
                    method: form.method,
                  });
                  props.onClose();
                } catch (e) {
                  console.error(e);
                }
              }}
            >
              <CheckIcon />
              Submit
            </button>
          </div>
        </div>
      </div>
      <div
        class={
          "mt-2 px-4 border-y border-opacity-20 border-base-content flex items-center"
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
    </div>
  );
}
