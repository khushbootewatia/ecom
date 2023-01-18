const mongoose = require('mongoose')

const checkOutSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
},
{
  timestamps: true,
})
const CheckOut = mongoose.model("Checkout",checkOutSchema)
module.exports = {CheckOut}
