const CartModel = require("./cart.model")


const updateCart = async(params,params2) => {
    return await CartModel.findOneAndUpdate(params,params2)
}

const removeCart = async(params) => {
    return await CartModel.findOneAndDelete(params)
}

module.exports = {
    updateCart,
    removeCart
}