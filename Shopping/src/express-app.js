const express = require('express')
const cors = require('cors')
const { appEvents, shopping } = require('./api');
const ErrorHandeler = require('./utils/error-handlers')
const AppLogs = require('./utils/api-request')


module.exports = async(app, channel) => {
    app.use(express.json({ limit: '1mb' }));
    app.use(express.urlencoded({ extended: true, limit: '1mb' }));
    app.use(cors());
    app.use(express.static(__dirname + '/public'))

    //api's

    // customer(app)
    // app.use(AppLogs)
    // product(app)
    // app.use(AppLogs)
    // appEvents(app)
    shopping(app, channel)
        // app.use(AppLogs)

    // app.use(AppLogs)
    app.use(ErrorHandeler);


}