const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const amqplib = require('amqplib')
const { APP_SECRET, EXCHANGE_NAME, MESSAGE_BROKER_URL, QUEUE_NAME, CUSTOMER_BINDING_KEY } = require('../config')


module.exports.GenerateSalt = async() => {
    return await bcrypt.genSalt()
}


module.exports.GeneratePassword = async(salt, password) => {
    return await bcrypt.hash(password, salt)
}

module.exports.validatePassword = async(enteredPassword, savedPassword, salt) => {
    return (await this.GeneratePassword(salt, enteredPassword)) === savedPassword
};



module.exports.GenerateSignature = async(payload) => {
    try {
        // console.log(payload)
        return jwt.sign(payload, APP_SECRET, { expiresIn: "2d" })
    } catch (error) {
        console.log('Error while generating the Signature', error)
    }
}

module.exports.validateSignature = async(req) => {
    const token = req.rawHeaders[1].split(" ")[1]
    const payload = await jwt.verify(token, APP_SECRET)
    req.user = payload
    return true
}


module.exports.FormateData = (data) => {
    try {
        return { data }
    } catch (error) {
        console.log('Error while formate data', error)
    }
}


//Create Channel for communication between services
module.exports.CreateChannel = async() => {
    try {
        const connection = await amqplib.connect(MESSAGE_BROKER_URL)
        const channel = await connection.createChannel()
        await channel.assertExchange(EXCHANGE_NAME, 'direct', false)
        return channel
    } catch (error) {
        throw error
    }
}

//Publish messages ** No need for customer because we are not publishing any massage for any service
// module.exports.PublishMessage = async(channel, service, message) => {
//     try {
//         await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message))
//     } catch (error) {
//         throw error
//     }
// }

//Subscribe Messages
module.exports.SubscribeMessage = async(channel, service) => {

    const appQueue = await channel.assertQueue(QUEUE_NAME)

    channel.bindQueue(appQueue.queue, EXCHANGE_NAME, CUSTOMER_BINDING_KEY)

    channel.consume(appQueue.queue, data => {
        console.log('Recieved Data')
        console.log(data.content.toString())
        service.SubscribeEvents(data.content.toString())
        channel.ack(data)
    })
}