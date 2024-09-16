const CustomerService = require('../service/customer-service')
const { CustomerModel } = require('../database/models')
const UserAuth = require('./middlewares/auth')


module.exports = (app) => {
    const service = new CustomerService
    app.post('/signup', async(req, res, next) => {
        try {
            const { email, phone, password } = req.body

            const userEmail = await CustomerModel.findOne({ email: email })
            if (userEmail) {
                return res.status(200).json({ "Status": "Entered eamil already taken" })
            } else {
                const user = await service.SignUp({ email, phone, password })
                    // console.log(req.body)
                return res.status(200).json(user)
            }
            return res.status(200).json({ "Status": "Not Found" })
        } catch (error) {
            console.log(error)
        }
    })

    app.get('/login', async(req, res, next) => {
        try {
            const { email, password } = req.body
                // console.log(req)
                // await service.SignIn({ email, password })
            const userData = await service.SignIn({ email, password })
            if (userData) {
                return res.status(200).json(userData)
            }
            return res.status(200).json({ "Status": "Not Found" })

            // return res.status(200).json({ "Status": "Not Found" })
        } catch (error) {
            console.log(error)
        }
    })

    app.get('/profile', UserAuth, async(req, res, next) => {
        try {
            const { _id } = req.user
            await service.GetProfile({ _id })
            const { data } = await service.GetProfile({ _id })
            if (data) {
                return res.status(200).json(data)
            }
            return res.status(200).json({ "Status": "Not Found" })
        } catch (error) {
            console.log(error)
        }
    })


    app.post('/address', UserAuth, async(req, res, next) => {
        const { _id } = req.user
        const { street, postalCode, city, country } = req.body
        const data = await service.AddNewAddress(_id, { street, postalCode, city, country })
        if (data) {
            return res.status(200).json(data)
        }
        return res.status(200).json({ "Status": "Not Found" })
    })


    app.get('/shopping-details', UserAuth, async(req, res, next) => {
        try {
            const { _id } = req.user
            const data = await service.GetShopingDetails(_id)
            if (data) {
                return res.status(200).json(data)
            }
            return res.status(200).json({ "Status": "Not Found" })
        } catch (error) {
            console.log(error)
        }
    })





}