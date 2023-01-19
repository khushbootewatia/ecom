const productSchema = require("../product/product.model")
const { getProduct, allProduct } = require('../product/product.service')
const { getSeller } = require('../seller/seller.service')
const { AppError } = require("../../utils/errorHandler");
const { upload } = require('../../utils/awsS3')
const { application } = require('express')

// ********************************product creation*******************************

const productCreation = async function (req, res, next) {
    try {
        const data = req.body
        // let files = req.files
        // let location = []
        // for (let i = 0; i < req.files.length; i++) {
        //     location.push(req.files[i].location)
        // }
        const sellerid = await getSeller({ email: req.decodedToken.email })
        data.sellerId = sellerid._id
        // data.productImage = location
        const product = await productSchema.create({ ...data })
        return res.status(200).send({ status: true, result: product })
    }
    catch (error) {
        error.reference = error.reference ? error.reference : "POST /product/create";
        next(error)
    }
}

// ********************************get products***********************************

const getAllProducts = async function (req, res, next) {
    try {
        const queryParams = req.query;
        const reference = "getAllProducts";
        const data = await allProduct({ isDeleted: false, ...queryParams })
        if (!data.length)
            throw new AppError(reference, "not found", 404)

        res.status(200).send({ status: true, msg: data })
    }
    catch (error) {
        error.reference = error.reference ? error.reference : "GET /product/getAllProduct";
        next(error)
    }
}

// *************************************updating product*********************************/

const updateProduct = async function (req, res, next) {
    try {
        const productId = req.params.productId
        const reference = "update"
        const data = req.body
        const checkProduct = await getProduct({ _id: productId })

        if (!checkProduct)
            throw new AppError(reference, "Provide valid ProductId", 400)

        if (checkProduct.isDeleted == true) {
            throw new AppError(reference, "No products with this Id or might be deleted", 404)
        }
        const updatedProduct = await productSchema.findByIdAndUpdate({ _id: productId }, data, { new: true })
        return res.status(200).send({ status: true, result: updatedProduct })

    }
    catch (error) {
        error.reference = error.reference ? error.reference : "PUT/product/update";
        next(error)
    }
}


//*************************************deleting the product ***************************/

const deleteById = async function (req, res, next) {
    try {
        const productId = req.params.productId
        const reference = "delete"

        const checkProduct = await getProduct({ _id: productId })

        if (checkProduct.isDeleted === true)
            throw new AppError(reference, "Product already Deleted", 400)

        const delUser = await productSchema.findByIdAndUpdate({ _id: productId }, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true })
        return res.status(200).send({ status: true, result: delUser })
    }
    catch (error) {
        error.reference = error.reference ? error.reference : "DELETE /product/deleteById";
        next(error)
    }
}

module.exports = {
    productCreation,
    getAllProducts,
    updateProduct,
    deleteById
}