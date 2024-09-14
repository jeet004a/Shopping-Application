const express = require('express')
const cors = require('cors')
const { product, appEvents } = require('./api');
const ErrorHandeler = require('./utils/error-handlers')
const AppLogs = require('./utils/api-request')
const bodyParser = require('body-parser')


module.exports = async(app) => {
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(express.json({ limit: '1mb' }));
    // app.use(express.urlencoded({ extended: true, limit: '1mb' }));
    app.use(cors());
    app.use(express.static(__dirname + '/public'))

    //api's

    // customer(app)
    // app.use(AppLogs)
    appEvents(app)
    product(app)
        // app.use(AppLogs)
        // shopping(app)
        // app.use(AppLogs)

    // app.use(AppLogs)
    app.use(ErrorHandeler);


}