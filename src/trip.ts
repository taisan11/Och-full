// import * as wasm from '../wasm/pkg/wasm.js'

// const initialize = async (): Promise<void> => {
//     await wasm.default()
// }

// async function main() {
//     await initialize()
//     console.log(wasm.convert_trip('#1234567890',10,true))
// }

// main()
const content = Bun.file("../wasm/pkg/wasm_bg.wasm");

console.warn("-- start compiling wasm --")
const module = await WebAssembly.compile(content)
.catch((e) => {
  console.error("ERROR:", e);
});
console.warn("-- wasm compiled --");

const lib = new WebAssembly.Instance(module, {
  env: {},
}).exports;
console.warn("-- wasm instance ready. lib:", lib);

// --- call func ---
console.warn("== Result of wasm func ==");
const ret = lib.func();
console.log(ret); // 42