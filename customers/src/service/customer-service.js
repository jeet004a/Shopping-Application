const { CustomerRepository } = require('../database')
const { GenerateSalt, GeneratePassword, FindCustomer, validateSignature, GenerateSignature, FormateData, validatePassword } = require('../utils/index')
const { CustomerModel, AddressModel } = require('../database/models')
class CustomerService {

    constructor() {
        this.repository = new CustomerRepository()
    }

    async SignUp({ email, name, image }) {
        // let salt = await GenerateSalt()
        // let userPassword = await GeneratePassword(salt, password)

        // console.log(userPassword)
        const userdata = await this.repository.CreateCustomer({ email, name, image })
        return userdata
    }

    async SignIn({ email, password }) {
        try {
            const existingUserData = await this.repository.FindCustomer({ email })
                // console.log(existingUserData)
            if (existingUserData) {

                const validUser = await validatePassword(password, existingUserData.password, existingUserData.salt)

                if (validUser) {
                    const token = await GenerateSignature({ email: existingUserData.email, _id: existingUserData._id });
                    const user = existingUserData
                    return FormateData({ id: existingUserData._id, token, user });
                }

            }
            return FormateData({ "Massage": "Data Not" })
        } catch (error) {
            console.log(error)
        }
    }

    async GetProfile(id) {
        try {
            const data = await this.repository.FindCustomerById(id)
                // await this.repository.FindCustomerById(id)
            return FormateData(data)
        } catch (error) {

        }
    }

    async AddNewAddress(id, payload) {
        try {
            const data = await this.repository.CreateAddress(id, payload)
            return FormateData(data)
        } catch (error) {
            console.log(error)
        }
    }

    async GetShopingDetails(id) {
        try {
            // console.log(id)
            const data = await this.repository.FindCustomerById(id)
            if (data) {
                return FormateData(data)
            }
            return FormateData("Not Found")
        } catch (error) {
            console.log(error)
        }
    }


    async AddToWishList(customerId, product) {

        // const product = { _id, name, desc, banner, price, available }
        const userdata = await this.repository.AddWishlistItem(customerId, product)
            // await this.repository.AddWishlistItem(customerId, product)
            // console.log(userdata)
        return FormateData(userdata)
    }

    async deleteToWishList(customerId, product) {
        const userdata = await this.repository.deleteToWishListItem(customerId, product)
        return FormateData(userdata)
    }

    async addToCart(userId, product, qty) {
        const data = await this.repository.addToCartItem(userId, product, qty)
        return FormateData(data)
    }

    async deleteToCart(customerId, productId) {
        const userData = await this.repository.deleteToCartItem(customerId, productId)
        return FormateData(userData)

    }

    async placeOrder(customerId, data) {
        await this.repository.placeOrder(customerId, data)
    }


    async SubscribeEvents(payload) {

        console.log('Triggering.... Customer Events')

        payload = JSON.parse(payload)
            // console.log(payload)
        const { event, data } = payload;
        // console.log(data)
        let { userId } = data;
        const user = await CustomerModel.find({ email: userId })
        userId = user[0]._id
        switch (event) {
            case 'ADD_TO_WISHLIST':
                this.AddToWishList(userId, data)
                break;
            case 'REMOVE_FROM_WISHLIST':
                // console.log(data)
                this.deleteToWishList(userId, data)
                break;
            case 'ADD_TO_CART':

                // this.addToCart(userId, product, qty, false);
                this.addToCart(userId, data, 1) //orginal
                    // console.log(data.qty)
                break;
            case 'DELETE_TO_CART':
                // this.addToCart(userId, product, qty, false);
                this.deleteToCart(userId, data, 1)
                    // console.log(data.qty)
                break;
            case 'PLACE_ORDER':
                // console.log('AAA')
                this.placeOrder(userId, data)
                break;
                // case 'CREATE_ORDER':
                //     this.ManageOrder(userId, order);
                //     break;
            case 'TEST':
                console.log('working subscriber')
                break;
            default:
                break;
        }

    }



}
module.exports = CustomerService