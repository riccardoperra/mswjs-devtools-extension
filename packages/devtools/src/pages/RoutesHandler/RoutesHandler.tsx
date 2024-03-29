import { createSignal, For, mapArray, Show, VoidProps } from "solid-js";
import { Checkbox, createSelectOptions, IconButton, Select } from "@codeui/kit";
import { DevtoolsRoute } from "@mswjs-devtools/shared";
import { CreateRouteHandlerForm } from "./CreateRouteForm/CreateRouteHandlerForm";
import { ScrollableWrapper } from "../../components/ScrollableWrapper/ScrollableWrapper";
import { PencilSquareIcon } from "../../components/PencilSquareIcon";
import { TrashIcon } from "../../components/TrashIcon";
import { RouteInfoLabel } from "./RouteInfoLabel/RouteInfoLabel";
import { EnhancedDevtoolsRoute } from "@mswjs-devtools/shared/src";
import { Button } from "@codeui/kit";

interface RoutesProps {
  routes: EnhancedDevtoolsRoute[];
  setSkipRoute: (id: string, skip: boolean) => void;
  createHandler: (route: DevtoolsRoute) => void;
  editHandler: (id: string, route: DevtoolsRoute) => void;
  onDeleteHandler: (id: string) => void;
}

export function RoutesHandler(props: VoidProps<RoutesProps>) {
  const [showCreateForm, setShowCreateForm] = createSignal(false);
  const [editingRoute, setEditingRoute] =
    createSignal<EnhancedDevtoolsRoute | null>(null);

  return (
    <div class={"flex flex-col h-full"}>
      <div class="px-4 my-2 flex items-center justify-between">
        <h1 class="text-lg font-bold">Available routes</h1>
        <Button
          size={"sm"}
          theme={"secondary"}
          onClick={() => setShowCreateForm(true)}
        >
          Add new
        </Button>
      </div>
      <ScrollableWrapper>
        <For each={props.routes}>
          {(route) => {
            const formHandlers = mapArray(
              () => route.handlers,
              (handler, index) =>
                ({
                  // TODO: fix select not working with value different
                  label: `Response ${index()} (${handler.status}) - ${
                    handler.description || "No description"
                  }`,
                  value: handler.id,
                }) as const,
            );

            const handlersSelectOptions = createSelectOptions(formHandlers, {
              key: "label",
              valueKey: "value",
            });

            return (
              <div class="py-2 flex items-center border-b border-neutral-700">
                <div class="flex w-full items-center gap-4">
                  <Checkbox
                    checked={!route.skip}
                    onChange={(checked) =>
                      props.setSkipRoute(route.id, checked)
                    }
                  />
                  <RouteInfoLabel
                    method={route.method as any}
                    label={route.url ?? ""}
                  />
                  {/*// TODO fix*/}
                  <Select
                    aria-label={"Selected handler"}
                    multiple={false}
                    size={"xs"}
                    {...handlersSelectOptions.props()}
                    {...handlersSelectOptions.controlled(
                      () => route.selectedHandler ?? route.handlers[0].id,
                      (value) =>
                        props.editHandler(route.id, {
                          ...route,
                          selectedHandler: value,
                        }),
                    )}
                    options={handlersSelectOptions.options()}
                  />
                  <Show when={route.custom}>
                    <span
                      class={
                        "badge badge-info text-black uppercase font-semibold"
                      }
                    >
                      Custom
                    </span>
                  </Show>
                  <div class="flex gap-2 ml-auto">
                    <IconButton
                      variant={"ghost"}
                      theme={"secondary"}
                      size={"xs"}
                      aria-label={"edit"}
                      onClick={() => setEditingRoute(route)}
                    >
                      <PencilSquareIcon
                        width={16}
                        height={16}
                      />
                    </IconButton>

                    <IconButton
                      variant={"ghost"}
                      theme={"secondary"}
                      size={"xs"}
                      aria-label={"edit"}
                      onClick={() => setEditingRoute(route)}
                    >
                      <TrashIcon
                        width={16}
                        height={16}
                      />
                    </IconButton>
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
            onSubmit={(data) => props.editHandler(editingRoute.id, data)}
            onClose={() => setEditingRoute(null)}
          />
        )}
      </Show>
    </div>
  );
}
