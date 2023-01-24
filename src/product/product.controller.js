const productSchema = require("../product/product.model")
const { getProduct, allProduct, deleteProduct, updatedProduct} = require('../product/product.service')
const { AppError } = require("../../utils/errorHandler");
const categorySchema = require("../category/category.model")

// ********************************product creation*******************************

const productCreation = async function (req, res, next) {
    try {
        const reference = "creation"
        const categoryId = req.params.categoryId
        const data = req.body
        if(req.seller.role === "seller"){
        data.sellerId = req.seller.seller._id

        const checkCategoryId = await categorySchema.findOne({_id: categoryId})
        data.categoryId = checkCategoryId
        
        const product = await productSchema.create({ ...data, categoryId})
        return res.status(200).send({ status: true, result: product })
        }
        else {
            throw new AppError(reference, "Only Seller can create product", 400)
        }
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

        res.status(200).send({ status: true, data: data })
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
        const updatedProduct = await updatedProduct({ _id: productId }, data, { new: true })
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
        const reference = "delete"
        const productId = req.params.productId
        
        const checkProduct = await getProduct({ _id: productId })

        if (checkProduct.isDeleted === true)
            throw new AppError(reference, "Product already Deleted", 400)

        const delUser = await deleteProduct({ _id: productId }, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true })
        console.log(delUser);
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