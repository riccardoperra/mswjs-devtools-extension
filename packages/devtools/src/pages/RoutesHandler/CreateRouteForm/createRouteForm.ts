import {
  DevtoolsHandler,
  DevtoolsRoute,
  EnhancedDevtoolsRoute,
  generateUUID,
  routeMethods,
} from "@mswjs-devtools/shared";
import { createStore } from "solid-js/store";
import { format } from "prettier";
import parserBabel from "prettier/parser-babel";
import { batch } from "solid-js";

function getInitialValue(): DevtoolsRoute {
  return {
    id: generateUUID(),
    method: routeMethods[0],
    url: "",
    selectedHandler: 0,
    handlers: [
      {
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
  const selectedHandlerIndex = () => form.selectedHandler ?? 0;
  const selectedHandler = () => form.handlers[selectedHandlerIndex()];

  const isHandlerValid = (index: DevtoolsHandler) => {
    const response = form.handlers[0].response;
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
    selectedHandlerIndex,

    deleteHandler(index: number) {
      batch(() => {
        setForm("handlers", (handlers) =>
          handlers.filter((_, i) => i !== index)
        );
        setForm("selectedHandler", form.handlers.length - 1);
      });
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
      const formattedResponse = format(handler.response, {
        tabWidth: 2,
        printWidth: 100,
        parser: "json",
        plugins: [parserBabel],
      });

      setForm(
        "handlers",
        selectedHandlerIndex(),
        "response",
        formattedResponse
      );
    },

    addNewHandler() {
      setForm("handlers", form.handlers.length, {
        response: "",
        status: 200,
        delay: 0,
        description: "",
      });

      setForm("selectedHandler", form.handlers.length - 1);
    },
  };
}
