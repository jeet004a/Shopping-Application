const { CustomerModel } = require('../models')
const { OrderModel, CartModel } = require('../models')
const { v4: uuid } = require('uuid')
class ShoppingRepository {
    async Orders() {
        console.log('Shopping Repo')
    }


    async CreateNewOrder(customerId, txnId) {
        try {
            const userProfile = await CustomerModel.findById(customerId).populate('cart.product')
            if (userProfile) {
                let orderAmount = 0
                let cartItem = userProfile.cart
                if (cartItem.length > 0) {
                    cartItem.map(item => {
                        orderAmount += item.product.price * item.unit
                    })
                    let orderNumber = uuid()


                    const order = new OrderModel({
                        orderId: orderNumber,
                        customerId: customerId,
                        amount: orderAmount,
                        status: 'received',
                        txnId: txnId,
                        items: cartItem
                    })

                    userProfile.cart = []

                    order.populate('items.product');
                    const orderResult = await order.save();

                    userProfile.orders.push(orderResult)

                    const userData = await userProfile.save()

                    return userData
                }
            }
        } catch (error) {
            console.log(error)
        }
    }



    async addToCart(userId, payload) {
        const user = await CartModel.findOne({ customerId: userId })
            // for (let i = 0; i < user.items.length; i++) {
            //     console.log(user.items[i])
            // }
            // console.log(payload)
        if (user) {
            let counter = 0
            for (let i = 0; i < user.items.length; i++) {
                if (user.items[i].product._id.toString() === payload._id.toString()) {
                    user.items[i].unit = user.items[i].unit + 1
                    counter = counter + 1
                }
            }
            if (counter > 0) {
                const userData = await user.save()
                return userData
            } else {
                const product = {
                    _id: payload._id.toString(),
                    name: payload.name,
                    desc: payload.desc,
                    banner: payload.banner,
                    type: payload.type,
                    price: payload.price,
                }
                const data = {
                    product,
                    unit: 1
                }
                user.items.push(data)
                const userProfile = await user.save()
                return userProfile
            }
        } else {
            const newData = new CartModel({
                customerId: userId,
                items: []
            })
            const product = {
                _id: payload._id.toString(),
                name: payload.name,
                desc: payload.desc,
                banner: payload.banner,
                type: payload.type,
                price: payload.price,
            }
            const data = {
                product,
                unit: 1
            }
            newData.items.push(data)
            const userProfile = await newData.save()
        }
    }


    async deleteToCart(userId, payload) {
        try {
            const userProfile = await CartModel.findOne({ customerId: userId })
            if (userProfile) {
                // console.log(userProfile)
                for (let i = 0; i < userProfile.items.length; i++) {
                    // console.log(userProfile.items[i])
                    if (userProfile.items[i].product._id.toString() === payload) {
                        if (userProfile.items[i].unit === 1) {
                            userProfile.items.splice(i, 1)
                            const data = await userProfile.save()
                            return data
                        } else if (userProfile.items[i].unit > 1) {
                            userProfile.items[i].unit = userProfile.items[i].unit - 1
                            const data = await userProfile.save()
                            return data
                        } else {
                            return "Product Not found"
                        }
                    }

                }
            } else {
                return "User Not found from cart model"
            }
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = ShoppingRepository