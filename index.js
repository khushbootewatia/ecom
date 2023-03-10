require('dotenv').config({path: ".env"})
const express = require('express')
const connectDb = require('./config/dbConnection')
const userRoute = require('./src/user/user.route')
const wishlistRoute = require('./src/wishlist/wishlist.route')
const route = require('./src/user/user.route')
const sellerRoute = require('./src/seller/seller.route')
//const forgetPasswordRoute = require("./src/forgetPassword/forgetPassword.route")

const logger = require('./utils/logger')
const {errorHandler} = require('./utils/errorHandler')
const cartRoute = require('./src/cart/cart.route')
const productRoute = require('./src/product/product.route')
const categoryRoute = require("./src/category/category.route")

const apiLogger = require("./utils/apiRoute")
const port = process.env.PORT

// const multer = require('multer')
// const multer1 = require('./src/util/aws')

const app = express()
app.use(express.json());
connectDb();
// app.use(errorController)

app.use('/api/user', apiLogger,userRoute);
app.use('/api/seller', apiLogger,sellerRoute);
app.use('/api/product',apiLogger,productRoute)
app.use('/api/wishlist',apiLogger, wishlistRoute)
app.use('/api/category',apiLogger, categoryRoute)
app.use('/api/cart',apiLogger,cartRoute)

// app.all('*', (req, res, next) => {
//     throw new appError(`Requested URL localhost:5001${req.path} not found!`, 404);

// })


// app.all('*', (req, res, next) => {
//     throw new AppError(`Requested URL localhost:3000${req.path} not found!`, 404);

// })

app.use((error, req, res, next) => {
    return errorHandler(error, res)
})


// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

// app.use('/apidocs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// // const swaggerUi = require("swagger-ui-express")
// // 
// // const swaggerDocument = require("./api/docs/swagger.json");
// swaggerUi.setup(swaggerDocument)

app.use(express.json());
app.use('/api/user', userRoute)
app.use('/api/wishlist', wishlistRoute)

swaggerUi.setup(swaggerDocument)

app.listen(port, function(){
    console.log(`running on port ${port}`)
})



