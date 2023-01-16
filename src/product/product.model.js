const mongoose = require('mongoose')
let objectId = mongoose.Schema.Types.ObjectId

const productSchema = new mongoose.Schema({
    sellerId: {
        type: objectId,
        ref : 'Seller'
    },
    productName: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true
    },

    totalQuantity: {
        type: Number,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    productImage: {
        type: String,
        // required: true
    },

    price: {
        type: Number,
        required: true
    },

    isDeleted: {
        type: Boolean,
        default: false
    },

    deletedAt: {
        type: Date,
        default: null
    },

}, {timestamps: true})

module.exports = mongoose.model('product', productSchema)