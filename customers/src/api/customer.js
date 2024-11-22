const CustomerService = require('../service/customer-service')
const { CustomerModel, AddressModel } = require('../database/models')
const UserAuth = require('./middlewares/auth')
const OAuth = require('./middlewares/OAuth')
const { SubscribeMessage, FormateData, GenerateSignature } = require('../utils')


module.exports = (app, channel) => {
    const service = new CustomerService

    SubscribeMessage(channel, service)


    app.get('/signup/google', OAuth, async(req, res, next) => {
        try {
            const { email, name, picture } = req.user.data
            const Customer = await CustomerModel.findOne({ email })
                // console.log(existingUser)
            if (!Customer) {
                console.log('1')
                const user = await service.SignUp({ email, name, image: picture })
                return res.status(200).json(user)
            } else {
                console.log('2')
                const token = await GenerateSignature({ email: email, id: Customer._id })
                const user = FormateData({ Customer, token })
                return res.status(200).json(user)
            }
            return res.status(404).json({ "Status": "Somthing Went Wrong" })
        } catch (error) {
            console.log(error)
        }
    })

    app.post('/login', async(req, res, next) => {
            try {
                // console.log(req)
                // const { email, password } = req.body
                // const user = await service.SignIn({ email, password })
                // if (user) {
                //     return res.status(200).json(user)
                // }
                return res.status(200).json({ "Status": "Not Found" })

                // return res.status(200).json({ "Status": "Not Found" })
            } catch (error) {
                console.log(error)
            }
        })
        //Get UserProfile OAuth
    app.get('/profile/:email', async(req, res, next) => { //UserAuth
        try {
            const email = req.params.email
            const data = await CustomerModel.findOne({ email }).populate('cart').populate('orders')
                // console.log(data)
                // const { _id } = req.user
                // await service.GetProfile({ _id })
                // const { data } = await service.GetProfile({ _id })
                //     // console.log(data)
            if (data) {
                // console.log(data)
                return res.status(200).json(data)
            }
            // console.log(data)
            return res.status(200).json({ "Status": "Not Found" })
        } catch (error) {
            console.log(error)
        }
    })

    //Below Add address OAuth
    app.post('/address/:email', async(req, res, next) => { //UserAuth
            try {
                // console.log(req.user)
                // const { _id } = req.user
                // console.log(req.body)

                const email = req.params.email
                const data = await CustomerModel.findOne({ email })
                const { _id } = data
                // console.log(_id)
                const { street, postalCode, city, country, state } = req.body
                const Userdata = await service.AddNewAddress(_id, { street, postalCode, city, country, state })


                if (data) {
                    return res.status(200).json(data)
                }
                // console.log(data)
                // console.log(req.body)
                // console.log(req.params.email)
                // console.log(Userdata)
                return res.status(200).json({ "Status": "Not Found" })
            } catch (error) {
                console.log(error)
            }
        })
        //Get Address Oauth
    app.get('/address/:email', async(req, res, next) => {
        try {
            // const id = req.params.id

            // const UserAddress = await AddressModel.findById(id)
            // if (UserAddress) {
            //     return res.status(200).json(UserAddress)
            // }

            const email = req.params.email
            const data = await CustomerModel.findOne({ email }).populate('address')
            const { _id } = data
            // console.log(data.address[0]._id)
            const id = data.address[0]._id
            const UserAddress = await AddressModel.findById(id)
                // console.log(UserAddress)
                // console.log(id)
            if (UserAddress) {
                return res.status(200).json(UserAddress)
            }
            return res.status(200).json({ "Status": "Not Found" })
        } catch (error) {
            console.log(error)
        }
    })


    app.get('/shopping-details/:email', async(req, res, next) => { //UserAuth,
        try {
            const user = await CustomerModel.findOne({ email: req.params.email })
                // console.log(user)
            const { _id } = user
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