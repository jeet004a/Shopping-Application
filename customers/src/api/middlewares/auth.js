const { validateSignature } = require('../../utils')

module.exports = async(req, res, next) => {
    // console.log('ABC', req.rawHeaders)
    const validateUser = await validateSignature(req)
    if (validateUser) {
        return next()
    }
    // console.log(req.user)
    // next()
    return res.status(403).json({ message: 'Not Authorized' })
}