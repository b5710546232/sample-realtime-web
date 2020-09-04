const express = require('express')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 3003

app.use(express.static(path.join(__dirname)))

let counter = 0;
let lastSendCounter = null;
const SERVER_UPDATE = 3000
setInterval(() => {
    counter++
}, SERVER_UPDATE)



app.get('/counter', (req, res) => {

    const isLongPolling = req.query.type === `long`;
    if (!isLongPolling) {
        //short polling
        res.send({
            message: counter
        })
        return;
    }

    // long polling
    const checkDataChange = (res) => {
        if (lastSendCounter !== counter) {
            lastSendCounter = counter
            res.send({
                message: counter
            })
        }
    }
    const timer = setInterval(() => {
        checkDataChange(res)
    }, 100) // check data every 100 milliseconds

    req.on(`close`, () => {
        clearInterval(timer)
        res.end()
    })


})

app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}!`))