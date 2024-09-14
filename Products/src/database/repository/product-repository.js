const { ProductModel } = require("../models");

class ProductRepository {
    async CreateProduct({
        name,
        desc,
        type,
        unit,
        price,
        available,
        suplier,
        banner,
    }) {
        try {
            const product = new ProductModel({
                name,
                desc,
                type,
                unit,
                price,
                available,
                suplier,
                banner,
            })
            const productResult = product.save()
            return productResult
        } catch (error) {
            console.log(error)
        }
    }

    async productByType(category) {
        const resultData = await ProductModel.find({ type: category })
        return resultData
    }

    async Product() {
        return await ProductModel.find()
    }

    async FindById(id) {
        return await ProductModel.findById(id)
    }

}

module.exports = ProductRepository