const { setOAuthUser } = require('../../utils/index')
module.exports = async(req, res, next) => {
    // const code = req.query.code
    // const googleRes = await oauth2Client.getToken(code);
    // oauth2Client.setCredentials(googleRes.tokes)
    //     // console.log('abc')
    // const userRes = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`)
    const user = await setOAuthUser(req)
        // console.log(user)
    if (user) {
        return next()
    }
    // return null
    return res.status(403).json({ message: 'Not Authorized' })
}