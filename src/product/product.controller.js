const productSchema = require("../product/product.model")
const sellerSchema = require('../seller/seller.model')
const AppError = require('../errorHandler/appError')
const { upload } = require('../../utils/awsS3')
const { application } = require('express')

const productCreation = async function (req, res, next) {
    try {
        const data = req.body
        // let files = req.files
        let location = []
        for (let i = 0; i < req.files.length; i++) {
            location.push(req.files[i].location)
        }
        data.image = location
        console.log(req.files[0].location);
        const sellerId = await sellerSchema.Seller.findOne({ email1: req.decodedToken.email })

        const product = await productSchema.create({ ...data, sellerId: sellerId._id })
        return res.status(200).send({ status: true, result: product })
    }
    catch (error) {
        next(error)
    }
}



const getAllProducts = async function (req, res) {
    try {
        const queryParams = req.query;

        const data = await productSchema.find({ isDeleted: false, ...queryParams }).sort({ productPrice: 1 })
        if (data.length)
            res.send({ status: false, msg: "not found"})
        res.status(200).send({ status: true, msg: sortedProducts })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



const updateProduct = async function (req, res, next) {
    try {
        const productId = req.params.productId

        const data = req.body
        const checkProduct = await productSchema.findOne({ _id: productId })

        if (!checkProduct)
            throw new AppError("Provide valid ProductId", 400)

        if (checkProduct.isDeleted == true) {
            throw new AppError("No products with this Id or might be deleted", 404)
        }
        const updatedProduct = await productSchema.findByIdAndUpdate({ _id: productId }, data, { new: true })
        return res.status(200).send({ status: true, result: updatedProduct })

    }
    catch (error) {
        next(error)
    }
}

const deleteById = async function (req, res, next) {
    try {
        const productId = req.params.productId

        const checkProduct = await productSchema.findOne({ _id: productId })

        if (checkProduct.isDeleted === true)
            throw new AppError("Product already Deleted", 400)

        const delUser = await productSchema.findByIdAndUpdate({ _id: productId }, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true })
        return res.status(200).send({ status: true, result: delUser })
    }
    catch (error) {
        next(error)
    }
}

module.exports = {
    productCreation,
    getAllProducts,
    updateProduct,
    deleteById
}