import { createSignal, For, Show, VoidProps } from "solid-js";
import { Checkbox } from "../../components/Checkbox";
import {
  DevtoolsHandler,
  SerializedRouteHandler,
} from "@mswjs-devtools/shared";
import { CreateRouteHandlerForm } from "./CreateRouteHandlerForm";
import { ScrollableWrapper } from "../../components/ScrollableWrapper/ScrollableWrapper";
import { PencilSquareIcon } from "../../components/PencilSquareIcon";
import { TrashIcon } from "../../components/TrashIcon";
import { RouteMethodBadge } from "./RouteMethodBadge/RouteMethodBadge";
import { RouteInfoLabel } from "./RouteInfoLabel/RouteInfoLabel";

interface RoutesProps {
  routes: SerializedRouteHandler[];
  setSkipRoute: (id: number, skip: boolean) => void;
  createHandler: (route: DevtoolsHandler) => void;
  onDeleteHandler: (id: number) => void;
}

export function RoutesHandler(props: VoidProps<RoutesProps>) {
  const [showCreateForm, setShowCreateForm] = createSignal(false);
  const [editingRoute, setEditingRoute] =
    createSignal<SerializedRouteHandler | null>(null);

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
              <div class="py-2 flex items-center border-b border-base-content border-opacity-25">
                <div class="flex w-full items-center gap-4">
                  <Checkbox
                    checked={!route.skip}
                    onChange={(checked) =>
                      props.setSkipRoute(route.id, !checked)
                    }
                  />

                  <RouteInfoLabel
                    method={route.info.method as any}
                    label={route.info.path as any}
                  />

                  <div class="flex gap-2 ml-auto">
                    <button
                      class="btn btn-sm btn-ghost btn-circle"
                      onClick={() => setEditingRoute(route)}
                    >
                      <PencilSquareIcon />
                    </button>

                    <button
                      class="btn btn-sm btn-ghost btn-circle"
                      onClick={() => props.onDeleteHandler(route.id)}
                    >
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

      <Show when={showCreateForm()}>
        <CreateRouteHandlerForm
          onCreate={props.createHandler}
          onClose={() => setShowCreateForm(false)}
        />
      </Show>
      <Show
        when={editingRoute()}
        keyed={true}
      >
        {(editingRoute) => (
          <CreateRouteHandlerForm
            initialValue={editingRoute}
            onCreate={props.createHandler}
            onClose={() => setEditingRoute(null)}
          />
        )}
      </Show>
    </div>
  );
}
