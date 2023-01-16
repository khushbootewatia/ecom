const express = require('express')
const connectDb = require('./config/dbConnection')
<<<<<<< Updated upstream
const route = require('./src/user/user.route')
=======
const wishlistRoute = require('./src/wishlist/wishlist.route')
const userRoute = require('./src/user/user.route')
const sellerRoute = require('./src/seller/seller.route')
const productRoute = require('./src/product/product.route')
const apiLogger = require('./logger/apiRoute')
//const forgetPasswordRoute = require("./src/forgetPassword/forgetPassword.route")
>>>>>>> Stashed changes
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
app.use(errorController)
<<<<<<< Updated upstream

app.use('/api/user', route)
=======
// app.use('/api/forgetPassword',forgetPasswordRoute)
>>>>>>> Stashed changes


app.all('*', (req, res, next) => {
    throw new appError(`Requested URL localhost:3000${req.path} not found!`, 404);

})


<<<<<<< Updated upstream
=======
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/apidocs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// const swaggerUi = require("swagger-ui-express")
// 
// const swaggerDocument = require("./api/docs/swagger.json");
swaggerUi.setup(swaggerDocument)

app.use(express.json());

app.use('/api/wishlist', wishlistRoute)
>>>>>>> Stashed changes

app.listen(3000, function(){
    console.log(`running on port ${3000}`)
})


