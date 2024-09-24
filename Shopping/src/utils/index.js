const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
    // const axios = require('axios')
const { APP_SECRET, MESSAGE_BROKER_URL, EXCHANGE_NAME, SHOPPING_BINDING_KEY, QUEUE_NAME } = require('../config')
const amqplib = require('amqplib')




module.exports.GenerateSalt = async() => {
    return await bcrypt.genSalt()
}


module.exports.GeneratePassword = async(password, salt) => {
    return await bcrypt.hash(password, salt)
}

module.exports.GenerateSignature = async(payload) => {
    try {
        //Print User Eamil And ObjectId to console log
        console.log(payload)
        return jwt.sign(payload, APP_SECRET, { expiresIn: "2d" })
    } catch (error) {
        console.log('Error while generating the Signature', error)
    }
}

module.exports.FormateData = (data) => {
    if (data) {
        return { data };
    } else {
        throw new Error("Data Not found!");
    }
};

module.exports.validatePassword = async(enteredPassword, existingPassword, salt) => {
    return (await this.GeneratePassword(enteredPassword, salt) === existingPassword)
}


module.exports.ValidateSignature = async(req) => {
    const token = req.rawHeaders[1].split(" ")[1]
    const payload = await jwt.verify(token, APP_SECRET)
    req.user = payload
    return true
}


// module.exports.PublishCustomerEvent = async(payload) => {
//     // console.log(payload)
//     axios.post('http://localhost:8000/customer/app-events', {
//             payload
//         })
//         // console.log(payload)
// }


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

//Publish messages 
module.exports.PublishMessage = async(channel, binding_key, message) => {
    try {
        await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message))
        console.log('Message Sent')
    } catch (error) {
        throw error
    }
}

//Subscribe Messages
module.exports.SubscribeMessage = async(channel, service) => {
    const appQueue = await channel.assertQueue(QUEUE_NAME)
    channel.bindQueue(appQueue.queue, EXCHANGE_NAME, SHOPPING_BINDING_KEY)
    channel.consume(appQueue.queue, data => {
        console.log('Recieved Data in Shopping')
        console.log(data.content.toString())
        service.SubscribeEvents(data.content.toString())
        channel.ack(data)
    })
}