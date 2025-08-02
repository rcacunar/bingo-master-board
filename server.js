const express = require('express');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let drawnNumbers = [];

wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ type: 'state', numbers: drawnNumbers }));
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'state' && Array.isArray(data.numbers)) {
        drawnNumbers = data.numbers;
        const msg = JSON.stringify({ type: 'state', numbers: drawnNumbers });
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
