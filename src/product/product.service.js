const productSchema = require('../product/product.model')
const { Seller } = require('../seller/seller.model')

const getProduct = async(params) => {
    return await productSchema.findOne(params)
}

const allProduct = async(params) => {
    return await productSchema.find(params).sort({productPrice: 1})
}


module.exports = {
    getProduct,
    allProduct
}

