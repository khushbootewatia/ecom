const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
    cartItemId: {
        type: String
    },
    userId: {
        type: String
    },
    categoryId: {
        type: String
    },
    productId: {
        type: String
    },
    quantity: {
        type: Number
    }

})
module.exports = new mongoose.model("cart", cartSchema);