import { style } from "@vanilla-extract/css";

export const wrapper = style({
  height: "100%",
  overflow: "hidden",
});

export const header = style({
  display: "flex",
  alignItems: "center",
  borderBottom: "1px solid hsl(0deg 0% 100% / 10%)",
  height: "46px",
});

export const content = style({
  position: "relative",
  height: "100%",
});
