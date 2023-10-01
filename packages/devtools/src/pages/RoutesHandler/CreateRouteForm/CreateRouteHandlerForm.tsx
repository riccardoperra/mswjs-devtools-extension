import { createEffect } from "solid-js";
import { CheckIcon } from "../../../components/CheckIcon";
import { SparklesIcon } from "../../../components/SparklesIcon";
import {
  DevtoolsRoute,
  EnhancedDevtoolsRoute,
  routeMethods,
} from "@mswjs-devtools/shared";
import { createRouteForm } from "./createRouteForm";
import { HandlerFormProvider } from "./createHandlerForm";
import { HandlerForm } from "./HandlerForm";
import { PlusIcon } from "../../../components/PlusIcon";
import {
  Button,
  createSelectOptions,
  IconButton,
  Select,
  TextField,
} from "@codeui/kit";
import { HandlersList } from "./HandlersList/HandlersList";

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
    selectHandler,
  } = routeForm;

  const methodSelectOptions = createSelectOptions(
    () =>
      routeMethods.map((route) => ({
        label: route,
        value: route,
      })),
    { key: "label", valueKey: "value" },
  );

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
        "w-[100%] h-[100%] absolute bg-base-200 w-full bottom-0 right-0 flex flex-col z-20"
      }
    >
      <div class="px-4 py-2 flex items-center justify-between shadow-lg border-t border-base-300">
        <h1 class="text-lg font-bold">{title()}</h1>
        <IconButton
          size={"sm"}
          variant={"ghost"}
          theme={"secondary"}
          aria-label={"Close"}
          onClick={props.onClose}
        >
          {/*// TODO export close icon*/}
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
        </IconButton>
      </div>
      <div class={"flex flex-nowrap h-full gap-2 px-3"}>
        <div class={"w-[350px] h-full overflow-auto pr-1"}>
          <Button
            block
            size={"sm"}
            theme={"tertiary"}
            onClick={addNewHandler}
            leftIcon={<PlusIcon />}
          >
            Add new handler
          </Button>
          <div class={"my-2"}>
            <HandlersList
              activeHandlerId={form.selectedHandler}
              onDelete={(handler) => deleteHandler(handler)}
              onSelect={(handler) => selectHandler(handler)}
              handlers={form.handlers}
            />
          </div>
        </div>
        <div class={"flex-1 gap-2"}>
          <div class={"flex gap-2"}>
            <div class={"w-[100px]"}>
              <Select
                size={"sm"}
                {...methodSelectOptions.props()}
                {...methodSelectOptions.controlled(
                  () => form.method as any,
                  (value) => setForm("method", value),
                )}
                options={methodSelectOptions.options()}
                theme={"filled"}
                multiple={false}
                aria-label={"Method"}
              />
            </div>
            <div class={"flex-1"}>
              <TextField
                size={"sm"}
                placeholder={"Type URL"}
                value={form.url}
                onChange={(value) => setForm("url", value)}
              />
            </div>
            <div class={"ml-auto flex gap-2"}>
              <Button
                size={"sm"}
                theme={"secondary"}
                leftIcon={<SparklesIcon />}
                onClick={() => formatJson()}
              >
                Format
              </Button>
              <Button
                theme={"primary"}
                size={"sm"}
                disabled={!isValid()}
                onClick={onSubmit}
                leftIcon={<CheckIcon />}
              >
                Submit
              </Button>
            </div>
          </div>

          <div class={"h-full mt-2"}>
            <HandlerFormProvider form={routeForm}>
              <HandlerForm />
            </HandlerFormProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
