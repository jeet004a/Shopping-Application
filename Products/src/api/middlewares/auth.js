const { ValidateSignature, Validate } = require('../../utils')
module.exports = async(req, res, next) => {
    // // console.log(req.body.headers)
    // await Validate(req)
    const validateUser = await ValidateSignature(req)
    if (validateUser) {
        return next()
    }
    console.log(req.user)
    next()
    return res.status(403).json({ message: 'Not Authorized' })
}