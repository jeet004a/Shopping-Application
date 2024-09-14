const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


const { APP_SECRET } = require('../config')

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