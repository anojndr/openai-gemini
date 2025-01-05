import { createServerAdapter } from '@whatwg-node/server';
import { createServer } from 'node:http';
import worker from "./src/worker.mjs";

const port = +(process.env.PORT || 8080);

// Keep-alive endpoint
const keepAlive = () => {
  const keepAliveUrl = `http://localhost:${port}/keep-alive`;
  setInterval(() => {
    fetch(keepAliveUrl)
      .then(() => console.log('Keep-alive ping successful')) // Removed unused 'response'
      .catch(error => console.error('Keep-alive ping failed:', error));
  }, 60000); // Ping every 60 seconds
};

// Add a simple keep-alive route
const serverAdapter = createServerAdapter(async (request) => {
  const url = new URL(request.url);
  if (url.pathname === '/keep-alive') {
    return new Response('OK', { status: 200 });
  }
  return worker.fetch(request);
});

const server = createServer(serverAdapter);
server.listen(port, () => {
  console.log('Listening on:', server.address());
  keepAlive(); // Start the keep-alive mechanism
});