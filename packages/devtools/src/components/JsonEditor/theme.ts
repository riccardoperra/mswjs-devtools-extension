import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";
import tokens from "./dark.json";
import { EditorView } from "@codemirror/view";
import { Extension } from "@codemirror/state";

export const parseColor = (hex: string) => {
  let color = tokens.palette[hex as keyof typeof tokens.palette] ?? hex;
  return `#${color}`;
};

export const highlightStyle: HighlightStyle = HighlightStyle.define([
  {
    tag: [t.comment],
    color: parseColor(tokens.palette["Grey-90"]),
  },
  {
    tag: [t.link],
    textDecoration: "underline",
  },
  {
    tag: [t.keyword],
    color: parseColor(tokens["text-attributes"].keyword.fgColor),
  },
  {
    tag: [t.typeOperator],
    color: parseColor(tokens["text-attributes"].keyword.fgColor),
  },
  {
    tag: [t.meta],
    color: parseColor(tokens["text-attributes"].metadata.fgColor),
  },
  {
    tag: [t.number],
    color: parseColor(tokens["text-attributes"].number.fgColor),
  },
  {
    tag: [t.bool],
    color: parseColor(tokens["text-attributes"].boolean.fgColor),
  },
  {
    tag: [t.string],
    color: parseColor(tokens["text-attributes"].string.fgColor),
  },
  {
    tag: [t.special(t.string)],
    color: parseColor(tokens["text-attributes"]["string.escape"].fgColor),
  },
  {
    tag: [t.regexp],
    color: parseColor(tokens["text-attributes"]["string.regexp"].fgColor),
  },
  {
    tag: [t.punctuation],
    color: parseColor(tokens["text-attributes"].punctuation.fgColor),
  },
  {
    tag: [t.variableName],
    color: parseColor(
      tokens["text-attributes"]["identifier.variable.local"].fgColor
    ),
  },
  {
    tag: [t.propertyName],
    color: parseColor(tokens["text-attributes"].keyword.fgColor),
  },
]);

export const colors = EditorView.theme(
  {
    "&": {
      color: parseColor(tokens.palette["Grey-120"]),
      background: parseColor(tokens.palette["Grey-10"]),
      fontSize: "15px",
    },
    "&.cm-editor.cm-focused": {
      outline: "none",
      border: "none",
    },
    ".cm-content": {
      fontFamily: "JetBrains Mono, Inter, monospace",
      padding: "0px",
    },
    ".cm-gutters": {
      backgroundColor: "transparent",
      border: "none",
    },
    ".cm-line": {
      padding: "2px 2px 2px 12px",
    },
    ".cm-gutters .cm-gutter.cm-lineNumbers .cm-gutterElement": {
      color: parseColor(tokens.colors["editor.lineNumber.text"]),
      paddingLeft: "12px",
      fontWeight: 600,
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
    },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
      {
        backgroundColor: parseColor(
          tokens["text-attributes"]["editor.selection"].bgColor
        ),
      },
    "&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket": {
      backgroundColor: parseColor(tokens.colors["editor.braceHighlight.fill"]),
    },
    ".cm-line.cm-activeLine": {
      backgroundColor: parseColor(tokens.colors["editor.currentLine.fill"]),
    },
    ".cm-gutterElement.cm-activeLineGutter": {
      backgroundColor: parseColor(tokens.colors["editor.currentLine.fill"]),
    },
    ".cm-tooltip": {
      backgroundColor: parseColor(tokens.colors["tooltip.fill"]),
      border: `1px solid ${parseColor(tokens.colors["tooltip.border"])}`,
      color: parseColor(tokens.colors["tooltip.text"]),
      borderRadius: "6px",
      overflow: "hidden",
      boxShadow: "0px 4px 16px 1px rgba(0,0,0,.25)",
    },
    ".cm-tooltip .cm-tooltip-lint.cm-tooltip-section .cm-diagnostic.cm-diagnostic-error":
      {
        border: "none",
      },
  },
  {
    dark: true,
  }
);

export const theme: Extension[] = [colors, syntaxHighlighting(highlightStyle)];
