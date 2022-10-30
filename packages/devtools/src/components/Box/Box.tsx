import type { JSXElement, PropsWithChildren } from "solid-js";
import { Sprinkles, sprinkles } from "src/ui/sprinkles.css";
import { Dynamic } from "solid-js/web";
import { omitProps, pickProps } from "../../core/props";

type BoxParameters = Sprinkles & {
  as?: any;
};

export function Box(props: PropsWithChildren<BoxParameters>): JSXElement {
  return (
    <Dynamic
      component={props.as ?? "div"}
      class={sprinkles(pickProps(props, [...sprinkles.properties.keys()]))}
      {...omitProps(props, ["as", ...sprinkles.properties.keys()])}
    />
  );
}
