// Create a web worker
const worker = new Worker('worker.js');

// Send a message to the worker
worker.postMessage({ message: 'Hello from the main thread' });

// Receive a message from the worker
worker.onmessage = (event) => {
  console.log(event.data.message);
}

