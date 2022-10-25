import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

export default defineConfig({
  css: {
    postcss: {
      plugins: [
        require("tailwindcss/nesting"),
        require("tailwindcss")({
          config: "./tailwind.config.js",
        }),
        require("autoprefixer"),
      ],
    },
  },
  plugins: [solidPlugin(), vanillaExtractPlugin()],
  optimizeDeps: {
    // Add both @codemirror/state and @codemirror/view to included deps to optimize
    include: [
      "@codemirror/language",
      "@codemirror/state",
      "@codemirror/lang-json",
      "@codemirror/view",
    ],
  },
});
