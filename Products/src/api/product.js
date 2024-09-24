const UserAuth = require('./middlewares/auth')
const ProductService = require('../services/product-service')
const AppLogs = require('../utils/api-request')
    // const { PublishCustomerEvent, PublishShoppingEvent } = require('../utils')
const { PublishMessage } = require('../utils')
const { SHOPPING_BINDING_KEY, CUSTOMER_BINDING_KEY } = require('../config')

module.exports = (app, channel) => {
    const service = new ProductService()

    // UserAuth, AppLogs,
    //Create Products
    app.post('/create', UserAuth, async(req, res, next) => {
            try {
                console.log(req.user)
                const { name, desc, banner, type, unit, price, available, supplier } = req.body
                const { data } = await service.CreateProduct({ name, desc, banner, type, unit, price, available, supplier })
                    // console.log(data)
                return res.json(data)
                    // return res.status(200).json({ "Msg": "ABC" })
            } catch (error) {
                // next(error)
            }
        })
        //Get All product By Ids
    app.get('/category/:type', UserAuth, AppLogs, async(req, res, next) => {
        try {
            // await AppLogs(req)
            const { data } = await service.ProductByType(req.params.type)
            return res.json(data)
        } catch (error) {
            next(error)
        }
    })

    //Get All Products
    app.get('/', UserAuth, AppLogs, async(req, res, next) => {
        try {
            // const { data } = await service.GetProducts()
            const data = await service.GetProducts()
            return res.json(data)
        } catch (error) {
            next(error)
        }
    })


    app.get('/:id', UserAuth, AppLogs, async(req, res, next) => {
        try {
            const { data } = await service.GetProductDescription(req.params.id)
            return res.status(200).json(data)
        } catch (error) {
            next(error)
        }
    });

    //Add a Item to wishlist
    app.put('/wishlist', UserAuth, AppLogs, async(req, res, next) => {
        try {
            const { _id } = req.user
            const { data } = await service.GetProductByPayload(_id, { productId: req.body._id, qty: 1 }, "ADD_TO_WISHLIST")

            // PublishCustomerEvent(data)
            PublishMessage(channel, CUSTOMER_BINDIN_KEY, JSON.stringify(data))

            return res.status(200).json(data.data)
                // return res.status(200).json({ "wishlist": "ABC" });
        } catch (error) {
            next(error)
        }
    })

    //Remove a Item to wishlist
    app.delete('/wishlist/:id', UserAuth, AppLogs, async(req, res, next) => {
        try {
            const { _id } = req.user
            const { data } = await service.GetProductByPayload(_id, { productId: req.params.id, qty: 1 }, "REMOVE_FROM_WISHLIST")
                // PublishCustomerEvent(data)
            PublishMessage(channel, CUSTOMER_BINDIN_KEY, JSON.stringify(data))
            return res.status(200).json(data.data)
                // return res.status(200).json({ "wishlist": "ABC" });
            return res.status(200).json(data);
        } catch (err) {
            next(err)
        }
    });

    //Added a item to cart
    app.put('/cart', UserAuth, AppLogs, async(req, res) => {
        try {
            const { _id, qty } = req.body
            const userId = req.user._id
            const { data } = await service.GetProductByPayload(userId, { productId: _id, qty: qty }, "ADD_TO_CART")
                // PublishCustomerEvent(data)
                // PublishShoppingEvent(data)

            PublishMessage(channel, CUSTOMER_BINDING_KEY, JSON.stringify(data))

            PublishMessage(channel, SHOPPING_BINDING_KEY, JSON.stringify(data))

            // const product = await service.GetProductById(_id)
            // const userCurrentData = await customerService.addToCart(userId, product, 1)
            // return res.status(200).json({ "Cart Updated": userCurrentData })
            return res.status(200).json(data.data)
                // return res.status(200).json({ "wishlist": "ABC" });
        } catch (error) {
            next(error)
                // console.log(error)
        }
    })

    // app.put('/cart', UserAuth, async(req, res) => {
    //     try {
    //         const { _id, qty } = req.body
    //         const userId = req.user._id
    //             // console.log(userId)
    //         const product = await service.GetProductById(_id)
    //         const userCurrentData = await customerService.addToCart(userId, product, 1)
    //         return res.status(200).json({ "Cart Updated": userCurrentData })
    //     } catch (error) {
    //         next(error)
    //     }
    // })

    //Delete item from cart
    app.delete('/cart/:id', UserAuth, AppLogs, async(req, res) => {
        try {
            const userId = req.user._id
            const { data } = await service.GetProductByPayload(userId, { productId: req.params.id, qty: 1 }, "DELETE_TO_CART")
            if (data) {
                // PublishCustomerEvent(data)
                // PublishShoppingEvent(data)
                PublishMessage(channel, CUSTOMER_BINDIN_KEY, JSON.stringify(data))
                PublishMessage(channel, SHOPPING_BINDING_KEY, JSON.stringify(data))
                return res.status(200).json({ "MSG": "Delete event FIRED" })
            }
            // console.log(data)
            return res.status(200).json({ "MSG": "Done" })

        } catch (error) {
            next(error)
        }
    })

}