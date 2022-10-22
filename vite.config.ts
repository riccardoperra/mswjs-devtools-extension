import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest";

export default defineConfig({
  plugins: [
    solidPlugin(),
    crx({
      manifest,
    }),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
    rollupOptions: {
      input: {
        panel: "./index.html",
        bridge: "bridge/bridge.ts",
      },
    },
  },
});
