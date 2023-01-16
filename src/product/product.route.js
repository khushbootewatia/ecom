const express = require('express')
const router = express.Router()
const { productCreation, getAllProducts, deleteById, updateProduct } = require('../product/product.controller')
const {upload} = require('../../utils/awsS3')

router.route('/productCreate/:mobileno')
    .post(upload.array("file"),productCreation);

router.route('/getAllProducts')
    .get(getAllProducts);

router.route('/update/:productId')
    .put(updateProduct)

router.route('/delete/:productId')
    .delete(deleteById)

module.exports = router;