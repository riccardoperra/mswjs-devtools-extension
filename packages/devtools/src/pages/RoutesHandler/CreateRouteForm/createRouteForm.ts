import {
  DevtoolsHandler,
  DevtoolsRoute,
  EnhancedDevtoolsRoute,
  generateUUID,
  routeMethods,
} from "@mswjs-devtools/shared";
import { createStore } from "solid-js/store";
import { format } from "prettier";

const defaultHandlerId = generateUUID();

function getInitialValue(): DevtoolsRoute {
  return {
    id: generateUUID(),
    method: routeMethods[0],
    url: "",
    selectedHandler: defaultHandlerId,
    handlers: [
      {
        id: defaultHandlerId,
        response: "{}",
        status: 200,
        delay: 0,
        description: "Lorem ipsum",
      },
    ],
  };
}

export type CreateRouteForm = ReturnType<typeof createRouteForm>;

export function createRouteForm() {
  const [form, setForm] = createStore<DevtoolsRoute>(getInitialValue());

  const selectedHandler = () =>
    form.selectedHandler
      ? form.handlers.find((handler) => handler.id === form.selectedHandler) ??
        form.handlers[0]
      : form.handlers[0];

  const selectedHandlerIndex = () => form.handlers.indexOf(selectedHandler());

  const isHandlerValid = (handler: DevtoolsHandler) => {
    if (handler.origin === "msw") return true;
    const response = handler.response;
    if (!response) {
      return false;
    }
    try {
      JSON.parse(response);
      return true;
    } catch (e) {
      return false;
    }
  };

  return {
    form,
    setForm,
    selectedHandler,

    deleteHandler(handler: DevtoolsHandler) {
      setForm("handlers", (handlers) =>
        handlers.filter(({ id }) => id !== handler.id),
      );
      const lastHandler = form.handlers[form.handlers.length - 1];
      setForm("selectedHandler", lastHandler.id);
    },

    selectHandler(handler: DevtoolsHandler) {
      console.info("select handler", handler.id);
      setForm("selectedHandler", handler.id);
    },

    fromEnhancedRoute(value: EnhancedDevtoolsRoute) {
      setForm({
        id: value.id,
        selectedHandler: value.selectedHandler,
        method: value.method,
        url: value.url,
        handlers: value.handlers ?? [],
      });
    },

    isValid() {
      return form.method && form.url && form.handlers.every(isHandlerValid);
    },

    formatJson(handler: DevtoolsHandler = selectedHandler()) {
      import("prettier/plugins/babel")
        .then((babel) =>
          format(handler.response, {
            tabWidth: 2,
            printWidth: 100,
            parser: "json5",
            plugins: [babel],
          }),
        )
        .then((response) => {
          setForm("handlers", selectedHandlerIndex(), "response", response);
        });
    },

    addNewHandler() {
      const id = generateUUID();
      setForm("handlers", form.handlers.length, {
        id: id,
        response: "{}",
        status: 200,
        delay: 0,
        description: "",
        origin: "custom",
      });
      setForm("selectedHandler", id);
    },
  };
}
