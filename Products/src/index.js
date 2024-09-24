const express = require('express')
const { PORT } = require('./config/index')

const { databaseConnection } = require('./database/index')
const expressApp = require('./express-app');
const { CreateChannel } = require('./utils')
    // const PORT = 8000

const StartServer = async() => {
    const app = express()
    await databaseConnection()

    const channel = await CreateChannel()

    await expressApp(app, channel)

    app.listen(PORT, () => console.log(`Server Runs At ${PORT}`)).on('error', (err) => {
        console.log('Error ', err)
        process.exit()
    })
}

StartServer()