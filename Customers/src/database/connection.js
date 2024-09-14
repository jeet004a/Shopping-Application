const { DB_URL } = require('../config')
const mongoose = require('mongoose')



module.exports = async() => {
    try {
        await mongoose.connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('DB_Connected')
    } catch (error) {
        console.log('Error ===============')
        console.log(error)
        process.exit(1)
    }
}