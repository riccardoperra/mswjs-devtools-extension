import { FlowProps } from "solid-js";
import * as styles from "./ScrollableWrapper.css";

export function ScrollableWrapper(props: FlowProps) {
  return <div class={styles.wrapper}>{props.children}</div>;
}
