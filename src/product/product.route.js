const express = require('express')
const router = express.Router()
const { productCreation, getAllProducts, deleteById, updateProduct } = require('../product/product.controller')
const {upload} = require('../../utils/awsS3')
const {authentic} = require('../../middleware/auth')

router.route('/create')
    .post(upload.array("file"),authentic, productCreation);

router.route('/getAllProducts')
    .get(getAllProducts);

router.route('/update/:productId')
    .put(updateProduct)

router.route('/delete/:productId')
    .delete(deleteById)

module.exports = router;