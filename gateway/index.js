const express = require('express')
const cors = require('cors')
const proxy = require('express-http-proxy')
const bodyParser = require('body-parser')

const app = express();

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))


app.use('/customer', proxy('http://localhost:8001/'))
app.use('/product', proxy('http://localhost:8002/'))
app.use('/', proxy('http://localhost:8003/'))

app.listen(8000, () => {
    console.log(`Server started at 8000`)
})