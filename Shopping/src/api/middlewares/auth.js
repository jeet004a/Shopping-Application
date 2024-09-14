const { ValidateSignature } = require('../../utils')
module.exports = async(req, res, next) => {

    const validateUser = await ValidateSignature(req)
    if (validateUser) {
        return next()
    }
    // console.log(req.user)
    // next()
    return res.status(403).json({ message: 'Not Authorized' })
}