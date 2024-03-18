const workerURL = new URL("../src/woker.ts", import.meta.url).href;
const worker = new Worker(workerURL);

worker.postMessage("hello");
worker.onmessage = event => {
  console.log(event.data);
};