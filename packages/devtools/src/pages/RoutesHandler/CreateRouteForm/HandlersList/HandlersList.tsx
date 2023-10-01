import { DevtoolsHandler } from "@mswjs-devtools/shared";
import { For } from "solid-js";
import { TrashIcon } from "../../../../components/TrashIcon";
import { IconButton } from "@codeui/kit";

interface HandlersListProps {
  handlers: DevtoolsHandler[];
  activeHandlerId?: string;
  onDelete: (handler: DevtoolsHandler) => void;
  onSelect: (handler: DevtoolsHandler) => void;
}

export function HandlersList(props: HandlersListProps) {
  return (
    <ul class={"flex flex-col gap-2"}>
      <For each={props.handlers}>
        {(handler, index) => {
          const isActive = () => props.activeHandlerId === handler.id;
          return (
            <li
              class={
                "p-4 bg-neutral-800 hover:bg-neutral-700 border-b-2 rounded-md"
              }
              classList={{
                "border-blue-600": isActive(),
                "border-neutral-700": !isActive(),
              }}
              onClick={() => props.onSelect(handler)}
            >
              <div class={"flex justify-between flex-start gap-2"}>
                <div class={"flex-1"}>
                  <div class={"flex items-center gap-3"}>
                    <h1 class={"text-lg"}>Response {index()}</h1>
                    <span class={"py-1 px-2 bg-neutral-700 rounded-xl text-xs"}>
                      {handler.status}
                    </span>
                  </div>
                  <h3 class={"text-sm text-neutral-400"}>
                    {handler.description || "No description"}
                  </h3>
                </div>
                <div>
                  <IconButton
                    size={"xs"}
                    aria-label={"Delete handler"}
                    disabled={
                      props.handlers.length === 1 || handler.origin === "msw"
                    }
                    theme={"negative"}
                    onClick={() => props.onDelete(handler)}
                  >
                    <TrashIcon
                      width={16}
                      height={16}
                    />
                  </IconButton>
                </div>
              </div>
            </li>
          );
        }}
      </For>
    </ul>
  );
}
