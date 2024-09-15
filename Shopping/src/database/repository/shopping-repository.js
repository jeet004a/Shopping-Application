const product = require('../../../../Products/src/api/product')
const { CustomerModel } = require('../models')
const { OrderModel, CartModel } = require('../models')
const { v4: uuidv4 } = require('uuid');
class ShoppingRepository {
    async Orders() {
        console.log('Shopping Repo')
    }


    async CreateNewOrder(customerId) {
        try {
            const userProfile = await CartModel.findOne({ customerId: customerId }).populate('items')

            // let order = {}
            if (userProfile) {
                let items = []
                let amount = 0
                for (let i = 0; i < userProfile.items.length; i++) {
                    // console.log(userProfile.items[i].product.price, " and unit is", userProfile.items[i].unit)
                    amount = amount + (userProfile.items[i].product.price * userProfile.items[i].unit)
                    const data = {
                        product: userProfile.items[i].product,
                        unit: userProfile.items[i].unit
                    }
                    items.push(data)
                }
                // console.log(items)
                // console.log(amount)
                const orderId = uuidv4()
                    // order = {
                    //         orderId: orderId,
                    //         customerId: userProfile.customerId,
                    //         amount: amount,
                    //         status: "Recived",
                    //         items: items
                    //     }
                const orderData = new OrderModel({
                    orderId: orderId,
                    customerId: userProfile.customerId,
                    amount: amount,
                    status: "Recived",
                    items: items
                })
                const finalOrder = await orderData.save()
                if (finalOrder) {
                    userProfile.items = []
                    await userProfile.save()
                    return finalOrder
                } else {
                    return "Order Not placed"
                }
            } else {
                return 'Profile Not Found'
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