const { DB_URL } = require('../config/index')
const mongoose = require('mongoose')


module.exports = async() => {
    try {
        await mongoose.connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
                // ,useCreateIndex: true
        });
        console.log('DB Connected')
    } catch (error) {
        console.log('DB Connection Error is ', error)
        process.exit(1)
    }
}