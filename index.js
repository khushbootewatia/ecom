const express = require('express')
const connectDb = require('./config/dbConnection')
const userRoute = require('./src/user/user.route')
const wishlistRoute = require('./src/wishlist/wishlist.route')
const route = require('./src/user/user.route')
const sellerRoute = require('./src/seller/seller.route')
//const forgetPasswordRoute = require("./src/forgetPassword/forgetPassword.route")
require('dotenv').config({path: ".env"})

const logger = require('./utils/logger')
const {errorHandler} = require('./utils/errorHandler')

const app = express()
app.use(express.json());
connectDb();
// app.use(errorController)

app.use('/api/user', route);
app.use('/api/seller', sellerRoute);
// app.use('/api/forgetPassword',forgetPasswordRoute)

app.use('/', (req, res,next) => {
    logger.info(`localhost:3000${req.originalUrl} - ${req.method} - ${req.ip}`)
    next()
}, route)


// app.all('*', (req, res, next) => {
//     throw new AppError(`Requested URL localhost:3000${req.path} not found!`, 404);

// })

app.use((error, req, res, next) => {
    return errorHandler(error, res)
})


// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');

// app.use('/apidocs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// // const swaggerUi = require("swagger-ui-express")
// // 
// // const swaggerDocument = require("./api/docs/swagger.json");
// swaggerUi.setup(swaggerDocument)

app.use(express.json());
app.use('/api/user', userRoute)
app.use('/api/wishlist', wishlistRoute)

app.listen(3000, function(){
    console.log(`running on port ${3000}`)
})



