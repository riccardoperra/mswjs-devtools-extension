import { style } from "@vanilla-extract/css";

export const wrapper = style({
  height: "100%",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
});

export const header = style({
  display: "flex",
  alignItems: "center",
  borderBottom: "1px solid hsl(0deg 0% 100% / 10%)",
  height: "46px",
  flexShrink: 1,
});

export const tabs = style({
  flexShrink: 1,
});

export const content = style({
  position: "relative",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  flexShrink: 1,
});
