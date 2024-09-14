const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const axios = require('axios')

const { APP_SECRET } = require('../config')



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

module.exports.PublishCustomerEvent = async(payload) => {
    axios.post('http://localhost:8000/customer/app-events', {
            payload
        })
        // console.log(payload)
}

module.exports.PublishShoppingEvent = async(payload) => {
    axios.post('http://localhost:8000/app-events', {
        payload
    })
}