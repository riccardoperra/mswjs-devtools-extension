import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

export default defineConfig({
  css: {
    postcss: {
      plugins: [
        require("tailwindcss")({
          config: "./tailwind.config.js",
        }),
      ],
    },
  },
  plugins: [solidPlugin(), vanillaExtractPlugin()],
  optimizeDeps: {
    // Add both @codemirror/state and @codemirror/view to included deps to optimize
    include: ["@codemirror/state", "@codemirror/view"],
  },
});
