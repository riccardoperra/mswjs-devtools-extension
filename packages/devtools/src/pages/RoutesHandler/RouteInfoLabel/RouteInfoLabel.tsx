import { RouteMethods } from "../../../constants/method";
import { Show, VoidProps } from "solid-js";
import { RouteMethodBadge } from "../RouteMethodBadge/RouteMethodBadge";
import * as styles from "./RouteInfoLabel.css";

interface RouteInfoLabelProps {
  method: RouteMethods;
  label: string;
}

export function RouteInfoLabel(props: VoidProps<RouteInfoLabelProps>) {
  return (
    <div>
      <Show
        when={props.method}
        keyed={true}
      >
        {(method) => <RouteMethodBadge method={method as any} />}
      </Show>
      <span class={styles.divider}>/</span>
      <span class={styles.label}>{props.label}</span>
    </div>
  );
}
