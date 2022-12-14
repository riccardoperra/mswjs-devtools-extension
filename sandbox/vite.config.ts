import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

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
  plugins: [solidPlugin()],
  optimizeDeps: {
    // Add both @codemirror/state and @codemirror/view to included deps to optimize
    include: ["@codemirror/state", "@codemirror/view"],
  },
});
