const cartModel = require("./cart.model")


const updateCart = async(params) => {
    return await cartModel.findOneAndUpdate(params)
}

const removeCart = async(params) => {
    return await cartModel.findOneAndDelete(params)
}

module.exports = {
    updateCart,
    removeCart
}