const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const amqplib = require('amqplib')

const { APP_SECRET, EXCHANGE_NAME, MESSAGE_BROKER_URL } = require('../config')



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
    // console.log(APP_SECRET)
    const token = req.rawHeaders[1].split(" ")[1]
    const payload = await jwt.verify(token, APP_SECRET)
    req.user = payload
    return true
}


//----------------------Below code are for transfer messages based on api calls--------------------------
// module.exports.PublishCustomerEvent = async(payload) => {
//     axios.post('http://localhost:8000/customer/app-events', {
//             payload
//         })
//         // console.log(payload)
// }

// module.exports.PublishShoppingEvent = async(payload) => {
//     axios.post('http://localhost:8000/app-events', {
//         payload
//     })
// }
//----------------------End Code--------------------------


//Create Channel for communication between services
module.exports.CreateChannel = async() => {
    try {
        const connection = await amqplib.connect(MESSAGE_BROKER_URL)
            // console.log(connection)
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
module.exports.SubscribeMessage = async(channel, service, binding_key) => {
    const appQueue = await channel.assertQueue('QUEUE_NAME')
    channel.bindQueue(appQueue.queue, EXCHANGE_NAME, binding_key)
    channel.consume(appQueue.queue, data => {
        console.log('Recieved Data')
        console.log(data.content.toString())
        channel.ack(data)
    })
}