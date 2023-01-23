const productSchema = require('../product/product.model')

const getProduct = async(params) => {
    return await productSchema.findOne(params)
}

const allProduct = async(params) => {
    return await productSchema.find(params).sort({productPrice: 1})
}

const deleteProduct = async(params) => {
    return await productSchema.findByIdAndUpdate(params)
}

const updation = async(params) => {
    return await productSchema.findByIdAndUpdate(params)
}


module.exports = {
    getProduct,
    allProduct,
    deleteProduct,
    updation
}

