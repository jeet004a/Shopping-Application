const { createLogger, transports } = require('winston')
const { AppError } = require('./app-errors')

const LogErrors = createLogger({
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'app_error.log' })
    ]
})


class ErrorLogger {
    constructor() {}
    async logError(err) {
        LogErrors.log({
                private: true,
                level: 'error',
                message: `${new Date()}-${JSON.stringify(err)}`
            })
            // console.log(req)
        return false
    }
}


const ErrorHandeler = async(err, req, res, next) => {
    const errorLogger = new ErrorLogger()
    await errorLogger.logError(err)
    return res.status(err.statusCode).json({ "Message": err.message })
    next()
}


module.exports = ErrorHandeler