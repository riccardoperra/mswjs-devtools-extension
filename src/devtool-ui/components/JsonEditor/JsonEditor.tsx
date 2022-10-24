import { createCodeMirror } from "solid-codemirror";
import {
  gutters,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  lineNumbers,
} from "@codemirror/view";
import { createEffect, onMount, VoidProps } from "solid-js";
import { theme } from "./theme";
import { json, jsonParseLinter } from "@codemirror/lang-json";
import {
  defaultKeymap,
  historyKeymap,
  indentWithTab,
  history,
} from "@codemirror/commands";
import { bracketMatching, indentOnInput } from "@codemirror/language";
import {
  closeBracketsKeymap,
  completionKeymap,
} from "@codemirror/autocomplete";
import { linter } from "@codemirror/lint";

interface JsonEditorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function JsonEditor(props: VoidProps<JsonEditorProps>) {
  const { ref, createExtension, editorView } = createCodeMirror({
    onValueChange: props.onValueChange,
    get value() {
      return props.value;
    },
  });

  createExtension([
    lineNumbers(),
    highlightActiveLine(),
    highlightActiveLineGutter(),
    indentOnInput(),
    history(),
    bracketMatching(),
    linter(jsonParseLinter()),
    keymap.of([
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...completionKeymap,
      ...historyKeymap,
      indentWithTab,
    ]),
    json(),
  ]);

  createExtension(theme);

  return (
    <div
      style={{
        "background-color": "#181818",
        width: "100%",
      }}
      class={"w-full h-full overflow-auto"}
      ref={(el) => onMount(() => ref(el))}
    />
  );
}
