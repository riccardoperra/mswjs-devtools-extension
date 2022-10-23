import { createSignal, For, Show, VoidProps } from "solid-js";
import { Checkbox } from "../../../components/Checkbox";
import styles from "../../DevtoolPanel.module.css";
import { SerializedRouteHandler } from "../../../../shared/types";
import { CreateRouteHandlerForm } from "./CreateRouteHandlerForm";

interface RoutesProps {
  routes: SerializedRouteHandler[];
  setSkipRoute: (id: number, skip: boolean) => void;
}

export function RoutesHandler(props: VoidProps<RoutesProps>) {
  const [showCreateForm, setShowCreateForm] = createSignal(false);

  return (
    <div>
      <div class="px-4 my-3 flex items-center justify-between">
        <h1 class="text-lg font-bold">Available routes</h1>
        <button
          class="btn btn-primary btn-sm"
          onClick={() => setShowCreateForm(true)}
        >
          Add new
        </button>
      </div>
      <div class={styles.HandlersList}>
        <For each={props.routes}>
          {(route) => {
            return (
              <div class={"py-2 flex items-center"}>
                <div class="form-control">
                  <label class="label cursor-pointer">
                    <Checkbox
                      checked={!route.skip}
                      onChange={(checked) =>
                        props.setSkipRoute(route.id, !checked)
                      }
                    />
                    <span class="label-text ml-4">
                      [{route.info.method}] {route.info.path}
                    </span>
                  </label>
                </div>
              </div>
            );
          }}
        </For>
      </div>
      <Show when={showCreateForm()}>
        <CreateRouteHandlerForm onClose={() => setShowCreateForm(false)} />
      </Show>
    </div>
  );
}
