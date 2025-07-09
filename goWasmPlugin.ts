// vite-plugin-go-wasm.ts
import { execSync } from "child_process";
import { resolve, join } from "node:path";
import type { Plugin, ViteDevServer } from "vite";
import { existsSync, statSync, globSync } from "node:fs";

export function goWasmPlugin(): Plugin {
  const goFiles = globSync("go_impl/*.go");
  const outputDir = resolve("@wasm");
  const outputPath = join(outputDir, "main.wasm");
  const verbose = process.env.NODE_ENV === "development";

  const context = {
    buildWasm(): void {
      try {
        const shouldBuild = this.shouldRebuild();

        if (shouldBuild) {
          console.log("🔨 Building Go WASM...");

          // Build command
          const buildCmd = [
            "go",
            "build -ldflags='-s -w'",
            "-o",
            outputPath,
            ...goFiles,
          ];

          execSync(buildCmd.join(" "), {
            env: {
              ...process.env,
              GOOS: "js",
              GOARCH: "wasm",
            },
            stdio: verbose ? "inherit" : "pipe",
          });

          const goRoot = execSync("go env GOROOT", { encoding: "utf8" }).trim();

          const wasmExecSrc = resolve(goRoot, "lib/wasm/wasm_exec.js");
          const wasmExecDst = resolve(outputDir, "wasm_exec.js");

          if (existsSync(wasmExecSrc)) {
            execSync(`cp "${wasmExecSrc}" "${wasmExecDst}"`);
          } else {
            console.warn(`⚠️  wasm_exec.js not found at: ${wasmExecSrc}`);
          }

          console.log("✅ Go WASM built successfully");
        } else if (verbose) {
          console.log("⏭️  WASM is up to date, skipping build");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error("❌ Failed to build Go WASM:", errorMessage);

        throw error;
      }
    },

    shouldRebuild(): boolean {
      if (!existsSync(outputPath)) {
        if (verbose) {
          console.log(`   WASM file doesn't exist: ${outputPath}`);
        }

        return true;
      }

      const wasmStats = statSync(outputPath);
      const wasmMtime = wasmStats.mtime;

      const outdatedFiles = goFiles.filter((goFile) => {
        if (existsSync(goFile)) {
          const goStats = statSync(goFile);
          const isOutdated = goStats.mtime > wasmMtime;
          if (verbose && isOutdated) {
            console.log(`   ${goFile} is newer than WASM file`);
          }
          return isOutdated;
        } else {
          console.warn(`⚠️  Go file not found: ${goFile}`);
          return false;
        }
      });

      return outdatedFiles.length > 0;
    },
  };

  return {
    name: "go-wasm-build",

    buildStart() {
      if (verbose) {
        console.log("🚀 Go WASM Plugin initialized");
        console.log(`   Watching: ${goFiles.join(", ")}`);
        console.log(`   Output: ${outputPath}`);
      }
      context.buildWasm();
    },

    configureServer(server: ViteDevServer) {
      // Watch Go files for changes
      const watcher = server.watcher;

      goFiles.forEach((file) => {
        if (existsSync(file)) {
          watcher.add(file);
        }
      });

      // Handle file changes
      const handleFileChange = (file: string) => {
        const isGoFile = goFiles.some((goFile) => {
          const absoluteGoFile = resolve(goFile);
          const absoluteChangedFile = resolve(file);

          return (
            absoluteChangedFile === absoluteGoFile || file.endsWith(goFile)
          );
        });

        if (isGoFile) {
          console.log(`📝 Go file changed: ${file}`);
          try {
            context.buildWasm();
            server.ws.send({
              type: "full-reload",
            });
          } catch (error) {
            server.ws.send({
              type: "error",
              err: {
                message: `Go WASM build failed: ${error}`,
                stack:
                  error instanceof Error ? (error.stack?.toString() ?? "") : "",
              },
            });
          }
        }
      };

      // Listen for file changes
      server.watcher.on("change", handleFileChange);
      server.watcher.on("add", handleFileChange);
    },

    // Handle build for production
    generateBundle() {
      if (verbose) {
        console.log("📦 Building WASM for production");
      }
      context.buildWasm();
    },
  };
}
