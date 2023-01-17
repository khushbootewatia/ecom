const express = require('express')
const connectDb = require('./config/dbConnection')
const wishlistRoute = require('./src/wishlist/wishlist.route')
const userRoute = require('./src/user/user.route')
const sellerRoute = require('./src/seller/seller.route')
const cartRoute = require('./src/cart/cart.route')
const productRoute = require('./src/product/product.route')
const categoryRoute = require("./src/category/category.route")
const apiLogger = require('./logger/apiRoute')
const port = process.env.PORT
require('dotenv').config({path: ".env"})

const errorController = require('./logger/error.controller')
const appError = require('./src/errorHandler/appError')

// const multer = require('multer')
// const multer1 = require('./src/util/aws')

const app = express()
app.use(express.json());
connectDb();

app.use('/api/user', apiLogger,userRoute);
app.use('/api/seller', apiLogger,sellerRoute);
app.use('/api/product',apiLogger,productRoute)
app.use('/api/wishlist',apiLogger, wishlistRoute)
app.use('/api/category',apiLogger, categoryRoute)
app.use('/api/cart',apiLogger,cartRoute)
app.use(errorController)

// app.all('*', (req, res, next) => {
//     throw new appError(`Requested URL localhost:5001${req.path} not found!`, 404);

// })


const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/apidocs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

swaggerUi.setup(swaggerDocument)

app.listen(port, function(){
    console.log(`running on port ${port}`)
})


