import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import linaria from "@wyw-in-js/vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { resolve } from "node:path";
import { createHtmlPlugin } from "vite-plugin-html";
import checker from "vite-plugin-checker";
import observerPlugin from "mobx-react-observer/swc-plugin";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: resolve(__dirname, "../go_impl/wasm_exec.js"),
          dest: "",
        },
        {
          src: resolve(__dirname, "../go_impl/main.wasm"),
          dest: "",
        },
      ],
    }),
    createHtmlPlugin({
      inject: {
        data: {
          wasmPreloadLinks: `
            <script async src="wasm_exec.js"></script>
            <link rel="preload" href="main.wasm" as="fetch" crossorigin>
          `,
        },
      },
    }),
    linaria(),
    react({
      plugins: [observerPlugin()],
    }),
    checker({
      typescript: true,
    }),
    visualizer({
      emitFile: true,
    }),
  ],
});
