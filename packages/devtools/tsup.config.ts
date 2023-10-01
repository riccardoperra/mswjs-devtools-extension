import { vanillaExtractPlugin } from "@vanilla-extract/esbuild-plugin";
import postcss from "postcss";
import autoprefixer from "autoprefixer";
import { defineConfig, Options } from "tsup";
import { solidPlugin } from "esbuild-plugin-solid";

async function processCss(css: string) {
  return await postcss([autoprefixer]).process(css, {
    from: undefined /* suppress source map warning */,
  }).css;
}

const entry = `src/index.tsx`;
const baseEntries = [entry];

export default defineConfig((config) => {
  const options: Options = {
    clean: config.watch ? false : true,
    dts: {
      entry: [entry],
    },
    target: "esnext",
    format: config.watch ? "esm" : ["cjs", "esm"],
    entryPoints: [...baseEntries],
    esbuildPlugins: [solidPlugin(), vanillaExtractPlugin()],
    noExternal: ["solid-codemirror"],
    external: [
      "solid-js",
      /^solid-js\/[\w-]+$/,
      /^@mswjs-devtools\/shared\/[\w-]+$/,
      /^@codemirror\/[\w-]+$/,
    ],
  };
  return options;
});
