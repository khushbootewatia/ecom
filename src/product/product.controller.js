// const productSchema = require('../product/product.model')
const productSchema = require("../product/product.model")
const sellerSchema = require('../seller/seller.model')
const { AppError } = require("../../utils/errorHandler");
const {upload} = require('../../utils/awsS3')
const { application } = require('express')

const productCreation = async function (req, res, next) {
    try {
        // const sellerId = req.params.sellerId
        // console.log(sellerId);               
        const data = req.body
        // let files = req.files
        let location = []
        for (let i = 0; i < req.files.length; i++) {
            location.push(req.files[i].location)
        }
        data.image = location
        console.log(req.files[0].location);
             
        // const findSeller = await sellerSchema.Seller.findOne({ _id:sellerId})
        // console.log(findSeller)        

        await productSchema.save({ sellerId })
        // if (!findSeller)
        //     throw new AppError("provide valid sellerId", 400)
         
        const product = await productSchema.create(data)
        return res.status(200).send({ status: true, result: product })
    }
    catch (error) {
        next(error)
    }
}


const getAllProducts = async function (req, res) {
    try {
        const queryParams = req.query;

        const data = await productSchema.find({ isDeleted: false, ...queryParams })

        const sortedProducts = data.sort((a, b) =>
            a.productName.localeCompare(b.productName)
        )
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