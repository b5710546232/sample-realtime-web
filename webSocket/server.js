const express = require('express')
const path = require('path')
const http = require('http')
const WebSocket = require('ws');


const app = express()
const PORT = process.env.PORT || 3005

app.use(express.static(path.join(__dirname)))

const server = http.createServer(app);
const wss = new WebSocket.Server({
    server,
    path: "/ws"
});

let counter = 0;
let text = `welcome`

wss.on('connection', (ws) => {
    setInterval(() => {
        counter++
        sendCounterWithText(ws, counter, text)
    }, 1000)

    ws.on('message', (message) => {
        message = JSON.parse(message)
        console.log('received: %s', message, message.event, message.event === `updateText`);
        switch (message.event) {
            case `ask`:
                sendCounterWithText(ws, counter, text)
                break;
            case `updateText`:
                console.log(text)
                text = message.value
                sendCounterWithText(ws, counter, text)

                break;
        }

    });
    sendCounterWithText(ws, counter, text)
});

function sendCounterWithText(ws, counter, text) {
    let msg = {
        event: `counter`,
        value: `${counter} ${text}`
    }
    ws.send(JSON.stringify(msg));
}

server.listen(PORT, () => console.log(`listening on http://localhost:${PORT}!`))