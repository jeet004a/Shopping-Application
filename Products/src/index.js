const express = require('express')
const { PORT } = require('./config/index')

const { databaseConnection } = require('./database/index')
const expressApp = require('./express-app');
// const PORT = 8000

const StartServer = async() => {
    const app = express()
    await databaseConnection()

    await expressApp(app)

    app.listen(PORT, () => console.log(`Server Runs At ${PORT}`)).on('error', (err) => {
        console.log('Error ', err)
        process.exit()
    })
}

StartServer()