import { globalFontFace, globalStyle, style } from "@vanilla-extract/css";

export const container = style({
  position: "fixed",
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
});

globalFontFace("JetBrainsMono-Regular", {
  src: "url(JetBrainsMono-Regular.ttf)",
});

globalFontFace("JetBrainsMono-Medium", {
  src: "url(JetBrainsMono-Medium.ttf)",
});

globalStyle("::-webkit-scrollbar", {
  width: "18px",
});

globalStyle("::-webkit-scrollbar-track", {
  backgroundColor: "transparent",
});

globalStyle("::-webkit-scrollbar-thumb", {
  backgroundColor: "#505050",
  borderRadius: "1000px",
  border: "6px solid transparent",
  backgroundClip: "content-box",
  transition: "background-color .2s",
});
