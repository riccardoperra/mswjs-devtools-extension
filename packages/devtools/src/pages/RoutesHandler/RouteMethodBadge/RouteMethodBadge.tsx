import * as styles from "./RouteMethodBadge.css";
import { RouteMethods } from "../../../../../shared/src/constants/method";

interface RouteMethodBadgeProps {
  method: RouteMethods;
}

export function RouteMethodBadge(props: RouteMethodBadgeProps) {
  const colors: Record<RouteMethods, string> = {
    GET: "text-blue-500",
    POST: "text-green-500",
    PUT: "text-orange-500",
    PATCH: "text-white-500",
    DELETE: "text-red-500",
    HEAD: "text-indigo-500",
    OPTION: "text-cyan-500",
    ALL: "text-green-500",
  };

  const classes = () =>
    `${styles.badge} ${colors[props.method]} badge badge-ghost`;

  return <span class={classes()}>{props.method}</span>;
}
