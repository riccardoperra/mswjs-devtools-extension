import { style } from "@vanilla-extract/css";
import { themeVars } from "./ui/global.css";

export const wrapper = style({
  height: "100%",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  color: "rgb(204, 204, 204)",
});

export const header = style({
  display: "flex",
  alignItems: "center",
  borderBottom: "1px solid hsl(0deg 0% 100% / 10%)",
  height: "52px",
  flexShrink: 1,
  paddingLeft: themeVars.global.spacing["4"],
  paddingRight: themeVars.global.spacing["4"],
  backgroundColor: themeVars.global.colors.base3,
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
  background: themeVars.global.colors.base3,
});
