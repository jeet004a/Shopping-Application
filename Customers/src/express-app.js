const express = require('express')
const cors = require('cors')
const { customer, appEvents } = require('./api')
const bodyParser = require('body-parser')

module.exports = async(app, channel) => {
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(express.json())
    app.use(cors())
        // app.use() 
        // app.use(express.static(__dirname + './public'))

    // appEvents(app)

    customer(app, channel)

}