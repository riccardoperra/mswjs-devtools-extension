import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      name: "@mswjs-devtools/devtools",
      entry: "./src/index.tsx",
      formats: ["cjs", "es"],
    },
  },
  plugins: [solidPlugin(), vanillaExtractPlugin(), dts()],
  optimizeDeps: {
    // Add both @codemirror/state and @codemirror/view to included deps to optimize
    include: ["@codemirror/state", "@codemirror/view"],
  },
});
