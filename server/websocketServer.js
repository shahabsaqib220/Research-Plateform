// websocketUtils.js
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

// Function to broadcast messages to all connected WebSocket clients
const broadcastMessage = (message) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};

module.exports = { broadcastMessage, wss };