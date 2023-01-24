const productSchema = require('../product/product.model')

const getProduct = async(params) => {
    return await productSchema.findOne(params)
}

const allProduct = async(params) => {
    return await productSchema.find(params).sort({productPrice: 1})
}

const deleteProduct = async(p1,p2,p3) => {
    return await productSchema.findOneAndUpdate(p1,p2,p3)
}

const updatingProduct = async(p1,p2,p3) => {
    return await productSchema.findByIdAndUpdate(p1,p2,p3)
}


module.exports = {
    getProduct,
    allProduct,
    deleteProduct,
    updatingProduct
}

