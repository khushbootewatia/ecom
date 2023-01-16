const express = require('express')
const connectDb = require('./config/dbConnection')
const userRoute = require('./src/user/user.route')
const sellerRoute= require('./src/seller/seller.route')
const wishlistRoute = require('./src/wishlist/wishlist.route')
const cartRoute= require('../ecom/src/cart/cart.route')
const categoryRoute = require('../ecom/src/category/category.route')
require('dotenv').config({path: ".env"})
const port = process.env.PORT
const logger = require('./logger/logger')
const errorController = require('./logger/error.controller')
const appError = require('./src/errorHandler/appError')


const app = express()
app.use(express.json());
connectDb();
app.use(errorController)


app.use('/api/seller', sellerRoute);


const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/apidocs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


swaggerUi.setup(swaggerDocument)

app.use(express.json());
app.use('/api/user', userRoute)
app.use('/api/wishlist', wishlistRoute)
app.use('/api/cart',cartRoute)
app.use('/api/category',categoryRoute)

app.listen(port, function(){
    console.log(`running on port ${port}`)
})


