import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest";

const isDev = process.env.NODE_ENV === "development";

export default defineConfig({
  plugins: [
    solidPlugin({
      dev: false,
    }),
    crx({
      manifest,
    }),
  ],
  server: {
    port: 3000,
  },
  build: {
    emptyOutDir: false,
    sourcemap: isDev ? "inline" : false,
    rollupOptions: {
      input: {
        panel: "index.html",
      },
    },
    target: "esnext",
  },
});
