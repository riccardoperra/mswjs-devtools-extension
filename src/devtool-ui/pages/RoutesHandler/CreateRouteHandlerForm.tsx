import { createStore } from "solid-js/store";
import { createEffect, For } from "solid-js";
import { devtoolsMessenger } from "../../../devtoolsMessenger";

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
}

export function CreateRouteHandlerForm(props: CreateRouteHandlerFormProps) {
  const [form, setForm] = createStore({
    method: METHODS[0] as string,
    url: "",
    response: "{}",
  });

  createEffect(() => console.log(JSON.stringify(form)));

  return (
    <div
      class={"w-[50%] h-[100%] absolute bg-base-300 w-full bottom-0 right-0"}
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
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Code</span>
          </label>
          <textarea
            class="textarea textarea-bordered h-24"
            placeholder="Bio"
            onInput={(event) => setForm("response", event.currentTarget.value)}
          ></textarea>
        </div>

        <div class={"mt-4"}>
          <button
            class={"btn btn-primary"}
            onClick={() => {
              try {
                const response = JSON.parse(form.response);
                devtoolsMessenger.dispatch("DEVTOOLS_CREATE_HANDLER", {
                  response,
                  url: form.url,
                  method: form.method,
                });
              } catch (e) {
                console.error(e);
              }
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
