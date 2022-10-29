import { createEffect, For } from "solid-js";
import { CheckIcon } from "../../../components/CheckIcon";
import { SparklesIcon } from "../../../components/SparklesIcon";
import {
  DevtoolsRoute,
  EnhancedDevtoolsRoute,
  generateUUID,
  routeMethods,
} from "@mswjs-devtools/shared";
import { createRouteForm } from "./createRouteForm";
import { HandlerFormProvider } from "./createHandlerForm";
import { HandlerForm } from "./HandlerForm";
import { PlusIcon } from "../../../components/PlusIcon";
import { TrashIcon } from "../../../components/TrashIcon";

interface CreateRouteHandlerFormProps {
  initialValue?: EnhancedDevtoolsRoute;
  onClose: () => void;
  onSubmit: (route: DevtoolsRoute) => void;
}

export function CreateRouteHandlerForm(props: CreateRouteHandlerFormProps) {
  const routeForm = createRouteForm();
  const {
    form,
    setForm,
    fromEnhancedRoute,
    isValid,
    formatJson,
    addNewHandler,
    deleteHandler,
    selectedHandlerIndex,
  } = routeForm;

  createEffect(() => {
    if (props.initialValue) {
      fromEnhancedRoute(props.initialValue);
    }
  });

  function onSubmit(): void {
    try {
      props.onSubmit(form);
      props.onClose();
    } catch (e) {
      console.error(e);
    }
  }

  const title = () => (props.initialValue ? "Edit route" : "Create route");

  return (
    <div
      class={
        "w-[100%] h-[100%] absolute bg-base-200 w-full bottom-0 right-0 flex flex-col"
      }
    >
      <div class="px-4 py-2 flex items-center justify-between shadow-lg border-t border-base-300">
        <h1 class="text-lg font-bold">{title()}</h1>
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
                value={form.url}
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
        <button
          class={"btn btn-primary btn-square btn-sm gap-2"}
          onClick={() => {
            return addNewHandler();
          }}
        >
          <PlusIcon />
        </button>
        <div class="form-control w-full">
          <select
            class="select select-sm select-bordered"
            onChange={(event) =>
              setForm(
                "selectedHandler",
                parseInt(event.currentTarget.value, 10)
              )
            }
          >
            <For each={form.handlers}>
              {(handler, index) => (
                <option
                  selected={index() === selectedHandlerIndex()}
                  value={index()}
                >
                  Response {index} ({handler.status}) -{" "}
                  {handler.description || "No description"}
                </option>
              )}
            </For>
          </select>
        </div>
        <button
          class={"btn btn-error btn-square btn-sm gap-2"}
          onClick={() => deleteHandler(form.handlers.length - 1)}
          disabled={form.handlers.length === 1}
        >
          <TrashIcon />
        </button>
      </div>

      <HandlerFormProvider form={routeForm}>
        <HandlerForm />
      </HandlerFormProvider>
    </div>
  );
}
