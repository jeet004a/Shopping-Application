const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    name: String,
    desc: String,
    banner: String,
    type: String,
    unit: Number,
    price: Number,
    available: Boolean,
    suplier: String
})



module.exports = mongoose.model('product', ProductSchema)