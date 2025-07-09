declare module "@wasm/wasm_exec" {
  declare global {
    interface Window {
      Go: typeof Go;
    }
  }

  export {};
}

declare module "@wasm/main.wasm" {}
