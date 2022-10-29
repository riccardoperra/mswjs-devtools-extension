import {
  createComponent,
  createContext,
  JSXElement,
  ParentProps,
  useContext,
} from "solid-js";
import { CreateRouteForm } from "./createRouteForm";
import { createDerivedSetter } from "../../../createDerivedSetter";
import { format } from "prettier";
import parserBabel from "prettier/parser-babel";

const Context = createContext<ReturnType<typeof $createHandlerForm>>();

interface HandlerFormProviderProps {
  form: CreateRouteForm;
}

function $createHandlerForm(form: CreateRouteForm) {
  return {
    formatJson() {
      return form.formatJson(form.selectedHandler());
    },
    get handler() {
      return form.selectedHandler();
    },
    get isValid() {
      const response = form.selectedHandler().response;
      if (!response) {
        return false;
      }
      try {
        JSON.parse(response);
        return true;
      } catch (e) {
        return false;
      }
    },
    get setHandler() {
      return createDerivedSetter(form.setForm, [
        "handlers",
        form.selectedHandlerIndex(),
      ]);
    },
  };
}

export function HandlerFormProvider(
  props: ParentProps<HandlerFormProviderProps>
): JSXElement {
  return (
    <Context.Provider value={$createHandlerForm(props.form)}>
      {props.children}
    </Context.Provider>
  );
}

export function getCreateRouteHandlerForm() {
  const value = useContext(Context);
  if (!value) {
    throw new Error("Missing CreateRouteForm context provider");
  }
  return value;
}

export function createHandlerForm() {}
