const express = require('express')
const router = express.Router()
const { productCreation, getAllProducts, deleteById, updateProduct } = require('../product/product.controller')
const {authentication} = require('../../utils/middleware/auth')
const {validationMiddleware} = require('../../utils/middleware/joiValidator')
const { validateProductSchema } = require('./product.validation')

router.post('/create/:categoryId',authentication,validationMiddleware(validateProductSchema),productCreation)

router.get('/getAllProducts',getAllProducts);

router.put('/update/:productId',updateProduct)

router.delete('/delete/:productId',deleteById)

module.exports = router;