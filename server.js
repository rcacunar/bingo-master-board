const express = require('express');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let gameState = { numbers: [], winningPattern: [], hiddenLetters: [] };

wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ type: 'state', ...gameState }));
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'state') {
        if (Array.isArray(data.numbers)) {
          gameState.numbers = data.numbers;
        }
        if (Array.isArray(data.winningPattern)) {
          gameState.winningPattern = data.winningPattern;
        }
        if (Array.isArray(data.hiddenLetters)) {
          gameState.hiddenLetters = data.hiddenLetters;
        }
        const msg = JSON.stringify({ type: 'state', ...gameState });
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(msg);
          }
        });
      }
    } catch (err) {
      console.error('Invalid message', err);
    }
  });
});

server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
