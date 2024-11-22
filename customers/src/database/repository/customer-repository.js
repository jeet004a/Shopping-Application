const { CustomerModel, AddressModel } = require('../models/index')
const { GenerateSignature, FormateData } = require('../../utils')

class CustomerRepository {

    async CreateCustomer({ email, name, image }) {

        const user = new CustomerModel({
                email,
                name,
                image,
                address: []
            })
            // console.log(password)
        const Customer = await user.save()
            // console.log(Customer)
        const token = await GenerateSignature({ email: email, id: Customer._id })
            // return FormateData({ id: Customer._id, token })
        return FormateData({ Customer, token })
            // return 'ABC'
            // return 'ABC'
    }

    async FindCustomer({ email }) {
        const user = await CustomerModel.findOne({ email: email })
            // console.log('repo:-', user)
        return user
            // return FormateData(user)
    }

    async FindCustomerById(id) {
        try {
            const userData = await CustomerModel.findById(id).populate('cart').populate('wishlist')
                // console.log(userData)
                // console.log(id)
            if (userData) {
                return userData
            }
            return "Not Found"

        } catch (error) {
            console.log('Error from FindCustomerById repo', error)
        }
    }


    async CreateAddress(id, payload) {
        try {
            const profile = await CustomerModel.findById(id).populate('address')
            if (profile) {
                if (profile.address) {
                    profile.address = []
                        // console.log('abc')
                }
                const { street, postalCode, city, country, state } = payload
                const userAddress = new AddressModel({
                    street,
                    postalCode,
                    city,
                    country,
                    state
                })
                await userAddress.save()
                profile.address.push(userAddress)
                const userData = await profile.save()
                return userData
            }
            return "Profile not found"
        } catch (error) {
            console.log(error)
        }
    }

    async AddWishlistItem(customerId, product) {
        try {
            const userProfile = await CustomerModel.findById(customerId).populate('wishlist')
            for (let i = 0; i < userProfile.wishlist.length; i++) {
                if (userProfile.wishlist[i]._id.toString() === product.data._id.toString()) {
                    return "Data Already Added"
                } else {
                    const data = {
                        _id: product.data._id.toString(),
                        name: product.data.name,
                        description: product.data.desc,
                        banner: product.data.banner,
                        avalable: product.data.available,
                        price: product.data.price
                    }
                    userProfile.wishlist.push(data)
                    const userData = await userProfile.save()
                    return userData
                }
            }

            return "ABC"
        } catch (error) {
            console.log(error)
        }
    }

    async deleteToWishListItem(customerId, product) {
        const profile = await CustomerModel.findById(customerId).populate('wishlist')
        let counter = 0
        const index = profile.wishlist.indexOf(product.data._id.toString())
        for (let i = 0; i < profile.wishlist.length; i++) {
            if (profile.wishlist[i]._id.toString() === product.data._id.toString()) {
                profile.wishlist.splice(index, 1)
                counter = counter + 1
                break;
            }
        }
        if (counter > 0) {
            const data = await profile.save()
            return data
        } else {
            return "Item is not present into your wishlist"
        }
    }

    async addToCartItem(userId, product, qty) {
        try {
            const userProfile = await CustomerModel.findById(userId).populate('cart')
                // console.log(product)
            let counter = 0
            for (let i = 0; i < userProfile.cart.length; i++) {
                if (userProfile.cart[i].product._id.toString() === product.data._id.toString()) {
                    userProfile.cart[i].unit = userProfile.cart[i].unit + 1
                    counter = counter + 1
                }
            }
            if (counter > 0) {
                const userData = await userProfile.save()
                return userData
                    // console.log(userProfile.cart)
            } else {
                const productData = {
                    _id: product.data._id.toString(),
                    name: product.data.name,
                    banner: product.data.banner,
                    price: product.data.price,
                    type: product.data.type
                }
                const data = {
                    product: productData,
                    unit: qty
                }
                userProfile.cart.push(data)
                const userData = await userProfile.save()
                    // console.log(userProfile.cart)
                return userData
            }
            // console.log(product)
            return "Not Found"
        } catch (error) {
            console.log(error)
        }

    }

    async deleteToCartItem(userId, product, qty) {
        try {
            const userProfile = await CustomerModel.findById(userId).populate('cart')
            let flag
            if (userProfile) {
                for (let i = 0; i < userProfile.cart.length; i++) {
                    // console.log(userProfile.cart[i].product._id.toString())
                    // console.log(product.data._id.toString())
                    //----original-----
                    if (userProfile.cart[i].product._id.toString() === product.data._id.toString()) {
                        if (userProfile.cart[i].unit === 1) {
                            userProfile.cart.splice(i, 1)
                            const data = await userProfile.save()
                            return data
                        } else if (userProfile.cart[i].unit > 1) {
                            userProfile.cart[i].unit = userProfile.cart[i].unit - 1
                            const data = await userProfile.save()
                            return data
                        } else {
                            return "Data Not Found"
                        }
                    }
                }
            } else {
                flag = "Data not found"
            }
            return flag
        } catch (error) {
            console.log(error)
        }
    }


    async placeOrder(userId, data) {
        const userProfile = await CustomerModel.findById(userId).populate('orders').populate('cart')
            // console.log(data)
        let order = {
            _id: data.data.data.orderId.toString(),
            amount: data.data.data.amount,
        }
        userProfile.orders.push(order)
        userProfile.cart = []
        const savedData = await userProfile.save()
        console.log(savedData)
    }

}

module.exports = CustomerRepository