import { JSX, ParentProps, Show } from "solid-js";
import * as styles from "./Button.css";

interface ButtonProps {
  icon?: JSX.Element;
  size?: "sm" | "md" | "xs";
  disabled?: boolean;
  variant?: "primary" | "secondary";
  onClick?: (event: MouseEvent) => void;
}

export function Button(props: ParentProps<ButtonProps>) {
  return (
    <button
      class={styles.button}
      data-with-icon={!!props.icon}
      data-size={props.size ?? "md"}
      data-variant={props.variant ?? undefined}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      <Show
        when={props.icon}
        keyed={true}
      >
        {(icon) => icon}
      </Show>
      {props.children}
    </button>
  );
}
