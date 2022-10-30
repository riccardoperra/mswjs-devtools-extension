import { createGlobalTheme } from "@vanilla-extract/css";
import { spacing } from "./spacing";
import { colors } from "./colors";

export const global = createGlobalTheme(":root", {
  screens: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },
  spacing,
  colors,
  borderRadius: {
    none: "0",
    sm: "0.125rem",
    default: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "1rem",
    full: "9999px",
  },
  boxShadow: {
    default: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
    outline: "0 0 0 3px rgba(66, 153, 225, 0.5)",
    none: "none",
  },
  cursor: {
    auto: "auto",
    default: "default",
    pointer: "pointer",
    wait: "wait",
    text: "text",
    move: "move",
    "not-allowed": "not-allowed",
  },
  fill: {
    current: "currentColor",
  },
  flex: {
    "1": "1 1 0%",
    auto: "1 1 auto",
    initial: "0 1 auto",
    none: "none",
  },
  flexGrow: {
    "0": "0",
    default: "1",
  },
  flexShrink: {
    "0": "0",
    default: "1",
  },
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "4rem",
  },
  fontWeight: {
    hairline: "100",
    thin: "200",
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
    black: "900",
  },
  inset: {
    "0": "0",
    auto: "auto",
  },
  maxHeight: {
    full: "100%",
    screen: "100vh",
  },
  maxWidth: {
    xs: "20rem",
    sm: "24rem",
    md: "28rem",
    lg: "32rem",
    xl: "36rem",
    "2xl": "42rem",
    "3xl": "48rem",
    "4xl": "56rem",
    "5xl": "64rem",
    "6xl": "72rem",
    full: "100%",
  },
  minHeight: {
    "0": "0",
    full: "100%",
    screen: "100vh",
  },
  minWidth: {
    "0": "0",
    full: "100%",
  },
  opacity: {
    "0": "0",
    "25": "0.25",
    "50": "0.5",
    "75": "0.75",
    "100": "1",
  },
  stroke: {
    current: "currentColor",
  },
  textColor: colors,
  zIndex: {
    auto: "auto",
    "0": "0",
    "10": "10",
    "20": "20",
    "30": "30",
    "40": "40",
    "50": "50",
  },
} as const);

export const themeVars = {
  global,
} as const;
