import {
  createCodeMirror,
  createEditorControlledValue,
  createEditorFocus,
  createEditorReadonly,
} from "solid-codemirror";
import {
  highlightActiveLine,
  highlightActiveLineGutter,
  KeyBinding,
  keymap,
  lineNumbers,
} from "@codemirror/view";
import { VoidProps } from "solid-js";
import { theme } from "./theme";
import { json, jsonParseLinter } from "@codemirror/lang-json";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { bracketMatching, indentOnInput } from "@codemirror/language";
import { autocompletion, closeBracketsKeymap } from "@codemirror/autocomplete";
import { linter } from "@codemirror/lint";
import { jsonAutocomplete } from "./propertyAutocomplete";

interface JsonEditorProps {
  value: string;
  onValueChange: (value: string) => void;
  onSave: () => void;
  disabled?: boolean;
}

export function JsonEditor(props: VoidProps<JsonEditorProps>) {
  const { ref, createExtension, editorView } = createCodeMirror({
    onValueChange: props.onValueChange,
  });

  createEditorControlledValue(editorView, () => {
    return typeof props.value === "string"
      ? props.value
      : JSON.stringify(props.value);
  });

  createEditorReadonly(editorView, () => props.disabled ?? false);

  createEditorFocus(editorView, (focused) => {
    if (!focused) {
      props.onSave();
    }
  });

  const saveKeymap: KeyBinding = {
    key: "Ctrl-s",
    preventDefault: true,
    run: (editor) => {
      props.onSave();
      return editor.hasFocus;
    },
  };

  createExtension([
    lineNumbers(),
    highlightActiveLine(),
    highlightActiveLineGutter(),
    indentOnInput(),
    history(),
    bracketMatching(),
    linter(jsonParseLinter()),
    json(),
    jsonAutocomplete(),
    autocompletion({
      defaultKeymap: true,
      icons: true,
      aboveCursor: true,
      activateOnTyping: true,
    }),
    keymap.of([
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...historyKeymap,
      saveKeymap,
    ]),
  ]);

  createExtension(theme);

  return (
    <div
      style={{
        "background-color": "#181818",
        width: "100%",
      }}
      class={"w-full h-full overflow-auto"}
      ref={ref}
    />
  );
}
