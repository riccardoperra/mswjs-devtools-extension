import { defineConfig, RollupOptions } from "rollup";
import withSolid from "rollup-preset-solid";
import { vanillaExtractPlugin } from "@vanilla-extract/rollup-plugin";
import json from "@rollup/plugin-json";
import commonjs from "@rollup/plugin-commonjs";

const config = withSolid({
  input: "src/index.tsx",
  plugins: [
    vanillaExtractPlugin(),
    json(),
    commonjs({
      include: /node_modules/,
      requireReturnsDefault: "auto", // <---- this solves default issue
    }) as any,
  ],
});

export default defineConfig(config as RollupOptions);
