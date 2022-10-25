import { createSignal, For, Show, VoidProps } from "solid-js";
import { Checkbox } from "../../components/Checkbox";
import { SerializedRouteHandler } from "@mswjs-devtools/shared";
import { CreateRouteHandlerForm } from "./CreateRouteHandlerForm";
import { ScrollableWrapper } from "../../components/ScrollableWrapper/ScrollableWrapper";
import { PencilSquareIcon } from "../../components/PencilSquareIcon";
import { TrashIcon } from "../../components/TrashIcon";

interface RoutesProps {
  routes: SerializedRouteHandler[];
  setSkipRoute: (id: number, skip: boolean) => void;
  createHandler: (any: any) => void;
}

export function RoutesHandler(props: VoidProps<RoutesProps>) {
  const [showCreateForm, setShowCreateForm] = createSignal(false);

  return (
    <div class={"flex flex-col h-full"}>
      <div class="px-4 my-3 flex items-center justify-between">
        <h1 class="text-lg font-bold">Available routes</h1>
        <button
          class="btn btn-primary btn-sm"
          onClick={() => setShowCreateForm(true)}
        >
          Add new
        </button>
      </div>
      <ScrollableWrapper>
        <For each={props.routes}>
          {(route) => {
            return (
              <div class={"py-2 flex items-center"}>
                <div class="flex w-full">
                  <Checkbox
                    checked={!route.skip}
                    onChange={(checked) =>
                      props.setSkipRoute(route.id, !checked)
                    }
                  />
                  <span class="label-text ml-4">
                    [{route.info.method}] {route.info.path}
                  </span>

                  <div class="flex gap-2 ml-auto">
                    <button class="btn btn-sm btn-ghost btn-circle">
                      <PencilSquareIcon />
                    </button>

                    <button class="btn btn-sm btn-ghost btn-circle">
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              </div>
            );
          }}
        </For>
      </ScrollableWrapper>
      <Show when={showCreateForm()}>
        <CreateRouteHandlerForm
          onCreate={props.createHandler}
          onClose={() => setShowCreateForm(false)}
        />
      </Show>
    </div>
  );
}
