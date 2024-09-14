const { createLogger, transports } = require('winston')

const LogRequests = createLogger({
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'app_log.log' })
    ]
})

class appLog {
    constructor() {}
    async Logs(req) {
        LogRequests.log({
                private: true,
                level: 'info',
                message: `${new Date()}-Host:${JSON.stringify(req.rawHeaders[11])}-method:${JSON.stringify(req.method)}-${JSON.stringify(req.route.path)}-/user/ ${JSON.stringify(req.user.email)}`
            })
            // console.log(req.route.path)
            // console.log(req.user.email)
            // console.log(req.rawHeaders[11])
        return false
    }
}

const AppLogs = async(req, res, next) => {
    const logs = new appLog()
    await logs.Logs(req)
    next()
}

module.exports = AppLogs