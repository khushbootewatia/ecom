const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId

const cartSchema = mongoose.Schema({


    userId: {
        type: ObjectId,
        ref: 'User'
    },
    categoryId: {
        type: ObjectId,
        ref: 'Product'
    },
    productId: {
        type: ObjectId,
        ref: 'Product'
    },
    quantity: {
        type: Number,
    required: true,
    min: [1, 'Quantity can not be less then 1.']
    },
  

},{timestamp: true})

module.exports = new mongoose.model("cart", cartSchema);