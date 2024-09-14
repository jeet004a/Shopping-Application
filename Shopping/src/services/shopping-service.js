const { ShoppingRepository } = require('../database')
const { FormateData } = require('../utils')
const { APIError, NotFoundError, AppError } = require('../utils/app-errors')

class ShoppingService {
    constructor() {
        this.repository = new ShoppingRepository()
    }

    async GetOrder() {
        try {
            await this.repository.Orders()
        } catch (error) {
            throw new APIError("Data Not found", error);
        }
    }

    async PlaceOrder(userInputs) {
        try {
            const { _id, txnNumber } = userInputs

            const orderResult = await this.repository.CreateNewOrder(_id, txnNumber)
                // await this.repository.CreateNewOrder(_id, txnNumber)
            return FormateData(orderResult)
        } catch (error) {
            throw new APIError("Data Not found", error);
        }
    }

    async addToCart(userId, payload) {
        try {
            await this.repository.addToCart(userId, payload)
        } catch (error) {
            console.log(error)
        }
    }

    async deleteToCart(userId, productId) {
        try {
            await this.repository.deleteToCart(userId, productId)
        } catch (error) {
            console.log(error)
        }
    }

    async SubscribeEvents(payload) {
        const { event } = payload
        const { userId } = payload.data
        switch (event) {
            // case event:
            case 'ADD_TO_CART':
                this.addToCart(userId, payload.data.data)
                break;
            case 'DELETE_TO_CART':
                this.deleteToCart(userId, payload.data.data._id)
                break;

            default:
                break;
        }
    }

}

module.exports = ShoppingService