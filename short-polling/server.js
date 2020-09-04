const express = require('express')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 3002

app.use(express.static(path.join(__dirname)))

let counter = 0;
setInterval(() => {
    counter++
}, 1000)

app.get('/counter', (req, res) => {
    res.send({
        message: counter
    })
})

app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}!`))