import { CompletionContext, CompletionResult } from "@codemirror/autocomplete";
import { syntaxTree } from "@codemirror/language";
import { Extension } from "@codemirror/state";
import { jsonLanguage } from "@codemirror/lang-json";

export function jsonAutocomplete(): Promise<Extension> {
  return import("@faker-js/faker").then((faker) => {
    return jsonLanguage.data.of({
      autocomplete: createJsonPropertyAutocomplete({
        faker: faker,
      }),
    });
  });
}

function createJsonPropertyAutocomplete(
  globalObject: Record<string, unknown>
): (context: CompletionContext) => CompletionResult | null {
  return (context) => {
    let nodeBefore = syntaxTree(context.state).resolveInner(context.pos, -1);
    if (
      nodeBefore.name !== "String" &&
      nodeBefore.parent?.name !== "Property"
    ) {
      return null;
    }

    // Match any word character
    const word = context.matchBefore(/\w*/);
    // Match the complete string inside the "" characters
    const source = context.matchBefore(/[A-Za-z0-9_.]*/);

    if (!word || !source) {
      return null;
    }

    return completeProperties(word.from, word.text, source!.text, globalObject);
  };
}

function completeProperties(
  from: number,
  variableName: string,
  source: string,
  globalObject: Record<string, any>
): CompletionResult | null {
  const variables = source.split(".");
  const lastIndex = variables.lastIndexOf(variableName);

  if (lastIndex === 0) {
    return {
      from,
      options: Object.keys(globalObject)
        .filter((key) => !key.startsWith("_"))
        .map((key) => {
          return {
            label: key,
            type:
              typeof globalObject[key] === "function" ? "function" : "variable",
          };
        }),
    };
  }

  let object: any = globalObject;
  for (const variable of variables.slice(0, lastIndex)) {
    object = object ? object[variable] : object;
  }

  if (!object) return null;

  return {
    from,
    options: Object.keys(object)
      .filter((key) => !key.startsWith("_"))
      .map((key) => {
        return {
          label: key,
          type: typeof object[key] === "function" ? "function" : "variable",
        };
      }),
  };
}
