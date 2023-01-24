const express = require('express')
const router = express.Router()
const { productCreation, getAllProducts, deleteById, updateProduct, getProductsBySeller } = require('../product/product.controller')
const {authentication, authorization} = require('../../utils/middleware/auth')
const {validationMiddleware} = require('../../utils/middleware/joiValidator')
const { validateProductSchema } = require('./product.validation')

router.post('/create/:categoryId',authentication,validationMiddleware(validateProductSchema),productCreation)

router.get('/getAllProducts',getAllProducts);

router.get('/getBySellerId',authentication, getProductsBySeller)

router.patch('/update/:productId',authentication, authorization, updateProduct)

router.delete('/delete/:productId',authentication, authorization, deleteById)

module.exports = router;