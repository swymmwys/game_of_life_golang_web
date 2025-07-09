import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import linaria from "@wyw-in-js/vite";
import { createHtmlPlugin } from "vite-plugin-html";
import checker from "vite-plugin-checker";
import observerPlugin from "mobx-react-observer/swc-plugin";
import { visualizer } from "rollup-plugin-visualizer";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import { goWasmPlugin } from "./goWasmPlugin";
import { resolve } from "node:path";

// https://vite.dev/config/
export default defineConfig({
  base: process.env.gh_repo ? `/${process.env.gh_repo.split("/")[1]}/` : "",
  resolve: {
    alias: {
      "@wasm": resolve(__dirname, "@wasm"), // because tsconfig path config is not respected by Vite
    },
  },
  plugins: [
    goWasmPlugin(),
    createHtmlPlugin({
      inject: {
        data: {
          wasmPreloadLinks: `
            <link rel="preload" href="@wasm/main.wasm" as="fetch" crossorigin>
          `,
        },
      },
    }),
    linaria({ prefixer: false }),
    react({
      plugins: [observerPlugin()],
    }),
    checker({
      typescript: true,
    }),
    visualizer({
      emitFile: true,
    }),
    // Handle WASM imports
    wasm(),
    topLevelAwait(),
  ],

  assetsInclude: ["**/*.wasm", "**/*.mp3"],

  server: {
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
    },
  },
});
