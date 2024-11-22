const UserAuth = require('./middlewares/auth')
const ShoppingService = require('../services/shopping-service')
    // const CustomerService = require('../services/customer-service')
    // const { PublishCustomerEvent } = require('../utils')
const { PublishMessage, SubscribeMessage } = require('../utils')
const { CUSTOMER_BINDING_KEY } = require('../config')
const { OrderModel, CartModel } = require('../database/models')
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


    //All orders

    app.post('/orderplace', async(req, res, next) => {
        try {
            const orderdata = await service.PlaceOrder(req.body.name)
            const { data } = await service.GetProductByPayload(req.body.name, orderdata, 'PLACE_ORDER')
            if (data) {
                PublishMessage(channel, CUSTOMER_BINDING_KEY, JSON.stringify(data))
            }

            // console.log('data', data)
            console.log('YYY')
                // return res.status(200).json("Nikal")
            return res.status(200).json(orderdata)
        } catch (error) {
            next(error)
        }
    })

    app.get('/orders/:email', async(req, res, next) => {
        try {
            console.log(req.params)
                // const { _id } = req.params
            const { email } = req.params
                // const OrderData = await OrderModel.findOne({ orderId: _id })
            const orderData = await OrderModel.find({ customerId: email }).populate('items')
            if (orderData) {
                return res.status(200).json(orderData)
            }
            // const { data } = await customer.GetShopingDetails(req.user._id)
            // return res.status(200).json(data.orders)
            return res.status(200).json({ "MSG": "Somthing Went Wrong" })
        } catch (error) {
            next(error)
        }
    })

}