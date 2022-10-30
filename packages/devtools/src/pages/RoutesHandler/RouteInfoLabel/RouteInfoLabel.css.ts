import { style } from "@vanilla-extract/css";

export const divider = style({
  marginLeft: "8px",
  marginRight: "8px",
  fontWeight: 600,
  userSelect: "none",
  color: "#666",
});

export const label = style({
  fontWeight: 500,
  fontSize: "14px",
  fontFamily: "Jetbrains Mono",
});
