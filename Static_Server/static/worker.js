// Receive a message from the main thread
self.onmessage = (event) => {
  console.log(event.data.message);
  // Send a message back to the main thread
  self.postMessage({ message: 'Hello from the worker' });
}
