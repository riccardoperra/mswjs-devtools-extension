import { style } from "@vanilla-extract/css";
import { themeVars } from "../../ui/global.css";

export const darkGrayScale = {
  gray1: "#111111",
  gray2: "#1d1d1d",
  gray3: "#232323",
  gray4: "#282828",
  gray5: "#2B2B2B",
  gray6: "#333333",
  gray7: "#3e3e3e",
  gray8: "#505050",
  gray9: "#707070",
  gray10: "#7e7e7e",
  gray11: "#a0a0a0",
  gray12: "#ededed",
  white: "#ffffff",
} as const;

export const button = style({
  display: "inline-flex",
  flexShrink: 0,
  userSelect: "none",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  borderRadius: themeVars.global.borderRadius.md,
  height: themeVars.global.spacing["12"],
  paddingLeft: themeVars.global.spacing["3"],
  paddingRight: themeVars.global.spacing["3"],
  fontWeight: themeVars.global.fontWeight.medium,
  cursor: "default",
  transitionProperty:
    "color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter",
  transitionDuration: "200ms",
  transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
  lineHeight: "1em",
  textTransform: "uppercase",

  ":disabled": {
    cursor: "default",
    opacity: 0.4,
  },

  selectors: {
    "&[data-with-icon=true]": {
      gap: themeVars.global.spacing["2"],
    },
    "&:active:focus": {
      animation: "none",
      transform: "scale(0.95)",
    },
    "&[data-variant=primary]": {
      backgroundColor: themeVars.global.colors.brand,
      color: themeVars.global.colors.white,
    },
    "&[data-variant=secondary]": {
      backgroundColor: darkGrayScale.gray6,
      color: themeVars.global.colors.white,
    },
    "&[data-size=sm]": {
      height: themeVars.global.spacing["8"],
      minHeight: themeVars.global.spacing["8"],
      paddingLeft: themeVars.global.spacing["3"],
      paddingRight: themeVars.global.spacing["3"],
      fontSize: themeVars.global.fontSize.sm,
    },
  },

  ":hover": {
    backgroundColor: darkGrayScale.gray6,
  },
});

// display: inline-flex;
// flex-shrink: 0;
// cursor: pointer;
// -webkit-user-select: none;
// -moz-user-select: none;
// user-select: none;
// flex-wrap: wrap;
// align-items: center;
// justify-content: center;
// border-color: transparent;
// border-color: hsl(var(--n) / var(--tw-border-opacity));
// text-align: center;
// transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;
// transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
// transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;
// transition-duration: 200ms;
// transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
// border-radius: var(--rounded-btn, 0.5rem);
// height: 3rem;
// padding-left: 1rem;
// padding-right: 1rem;
// font-size: 0.875rem;
// line-height: 1.25rem;
// line-height: 1em;
// min-height: 3rem;
// font-weight: 600;
// text-transform: uppercase;
// text-transform: var(--btn-text-case, uppercase);
// text-decoration-line: none;
// border-width: var(--border-btn, 1px);
// animation: button-pop var(--animation-btn, 0.25s) ease-out;
// --tw-border-opacity: 1;
// --tw-bg-opacity: 1;
// background-color: hsl(var(--n) / var(--tw-bg-opacity));
// --tw-text-opacity: 1;
// color: hsl(var(--nc) / var(--tw-text-opacity));
