import { keyframes, createVar, style } from "@vanilla-extract/css";

const outerShadow = createVar();
const innerShadow = createVar();

const pulse = keyframes({
  "0%": {
    filter: `drop-shadow(0 0 0 ${outerShadow})`,
    boxShadow: `0 0 0 ${innerShadow}`,
  },
  "100%": {
    filter: `drop-shadow(0 0 90px rgba(0,0,0,0))`,
    boxShadow: `0 0 0 35px rgba(0,0,0,0)`,
  },
});

export const wrapper = style({
  height: "100%",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const loading = style({
  vars: {
    [innerShadow]: "rgb(253,105,51)",
    [outerShadow]: "rgb(209,35,35)",
  },
  display: "inline-flex",
  alignItems: "center",
  borderRadius: "50%",
  padding: "24px",
  justifyContent: "center",
  animation: `${pulse} 1s infinite`,
});

export const mswLogo = style({
  background: "url(/msw.svg)",
  width: "124px",
  height: "124px",
});
