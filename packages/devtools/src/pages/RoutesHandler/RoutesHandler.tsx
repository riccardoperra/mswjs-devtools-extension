import { createSignal, For, Show, VoidProps } from "solid-js";
import { Checkbox } from "../../components/Checkbox";
import { DevtoolsRoute } from "@mswjs-devtools/shared";
import { CreateRouteHandlerForm } from "./CreateRouteForm/CreateRouteHandlerForm";
import { ScrollableWrapper } from "../../components/ScrollableWrapper/ScrollableWrapper";
import { PencilSquareIcon } from "../../components/PencilSquareIcon";
import { TrashIcon } from "../../components/TrashIcon";
import { RouteInfoLabel } from "./RouteInfoLabel/RouteInfoLabel";
import { EnhancedDevtoolsRoute } from "@mswjs-devtools/shared/src";

interface RoutesProps {
  routes: EnhancedDevtoolsRoute[];
  setSkipRoute: (id: number, skip: boolean) => void;
  createHandler: (route: DevtoolsRoute) => void;
  editHandler: (id: number, route: DevtoolsRoute) => void;
  onDeleteHandler: (id: number) => void;
}

export function RoutesHandler(props: VoidProps<RoutesProps>) {
  const [showCreateForm, setShowCreateForm] = createSignal(false);
  const [editingRoute, setEditingRoute] =
    createSignal<EnhancedDevtoolsRoute | null>(null);

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
                    method={route.method as any}
                    label={route.url ?? ""}
                  />

                  <select
                    class={"select select-xs select-bordered"}
                    onChange={(event) => {
                      props.editHandler(route.id, {
                        ...route,
                        selectedHandler: parseInt(
                          event.currentTarget.value,
                          10
                        ),
                      });
                    }}
                  >
                    <For each={route.handlers}>
                      {(handler, index) => (
                        <option
                          selected={index() === route.selectedHandler}
                          value={index()}
                        >
                          Response {index} ({handler.status}) -{" "}
                          {handler.description || "No description"}
                        </option>
                      )}
                    </For>
                  </select>

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
          onSubmit={props.createHandler}
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
            onSubmit={() => props.editHandler(editingRoute.id, editingRoute)}
            onClose={() => setEditingRoute(null)}
          />
        )}
      </Show>
    </div>
  );
}