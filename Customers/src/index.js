const express = require('express')
const app = express()
const { PORT } = require('./config')
const expressApp = require('./express-app')
const { databaseConnection } = require('./database')




const StartServer = async() => {
    const app = express()

    await databaseConnection()

    app.listen(PORT, () => console.log(`Server listen ${PORT}`)).on('error', (err) => {
        console.log('Error', err)
        process.exit()
    })

    await expressApp(app)
}

StartServer()