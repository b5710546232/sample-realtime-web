const express = require('express')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 3004

app.use(express.static(path.join(__dirname)))

let counter = 0;

app.get('/counter', (req, res) => {
    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive"
    })
    const timer = setInterval(() => {
        counter++
        const messageJSON = { message: `${counter}` }
        const eventName = `counter`
        const event = `event: ${eventName}\n`;
        const data = `data: ${JSON.stringify(messageJSON)}\n`
        res.write(`${event}${data}\n`)
    }, 1000)

    req.on(`close`, () => {
        clearInterval(timer)
        res.end()
    })
})

app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}!`))