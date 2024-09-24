const UserAuth = require('./middlewares/auth')
const ShoppingService = require('../services/shopping-service')
    // const CustomerService = require('../services/customer-service')
    // const { PublishCustomerEvent } = require('../utils')
const { PublishMessage, SubscribeMessage } = require('../utils')
const { CUSTOMER_BINDING_KEY } = require('../config')
const AppLogs = require('../utils/api-request')


module.exports = (app, channel) => {
    const service = new ShoppingService()
    SubscribeMessage(channel, service)
        // const customer = new CustomerService()
        //Create Order
    app.post('/order', UserAuth, AppLogs, async(req, res, next) => {
            try {
                const { _id } = req.user

                // const { txnNumber } = req.body
                // const data = await service.PlaceOrder({ _id, txnNumber })
                // await service.PlaceOrder({ _id, txnNumber })
                // const data = await service.PlaceOrder({ _id })
                const orderdata = await service.PlaceOrder({ _id })
                    // return res.status(200).json({ "Hello": "order" })
                const { data } = await service.GetProductByPayload(_id, orderdata, 'PLACE_ORDER')
                    // PublishCustomerEvent(data)

                PublishMessage(channel, CUSTOMER_BINDING_KEY, JSON.stringify(data))

                return res.status(200).json(orderdata)
            } catch (error) {
                next(error)
            }
        })
        //Get Order Details
    app.get('/orders', UserAuth, AppLogs, async(req, res, next) => {
        try {
            // const { data } = await customer.GetShopingDetails(req.user._id)
            return res.status(200).json(data.orders)
        } catch (error) {
            next(error)
        }
    })

    //Get Cart Details
    app.get('/cart', UserAuth, AppLogs, async(req, res) => {
        try {
            const { data } = await customer.GetShopingDetails(req.user._id)
            return res.status(200).json(data.cart)
        } catch (error) {
            next(error)
        }
    })

    app.get('/test', UserAuth, async(req, res) => {
        try {

            console.log('Tested')
            return res.status(200).json({ "Hello": "ABC" })
        } catch (error) {
            console.log(error)
        }
    })

}