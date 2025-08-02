const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());

let messages = [];

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.send(JSON.stringify({ type: 'history', messages }));

  ws.on('message', (message) => {
    const msg = JSON.parse(message);
    messages.push(msg);

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'message', message: msg }));
      }
    });
  });

  ws.on('close', () => console.log('Client disconnected'));
});

server.listen(4000, () => {
  console.log('WebSocket server running on port 4000');
});
