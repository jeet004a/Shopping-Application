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
            // const { _id, txnNumber } = userInputs
            const { _id } = userInputs
            // console.log(_id)
            // const orderResult = await this.repository.CreateNewOrder(_id, txnNumber)
            // await this.repository.CreateNewOrder(_id, txnNumber)
            // const orderResult = await this.repository.CreateNewOrder(_id)
            const data = await this.repository.CreateNewOrder(_id)
            return FormateData(data)

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

    async GetProductByPayload(userId, data, event) {
        if (data) {
            const payload = {
                event: event,
                data: { userId, data }
            }
            return FormateData(payload)
        } else {
            return FormateData({ "msg": "Product Not available" })
        }
    }

}

module.exports = ShoppingService