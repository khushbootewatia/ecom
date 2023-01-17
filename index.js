const express = require('express')
const connectDb = require('./config/dbConnection')
const cookieParser = require('cookie-parser');
const wishlistRoute = require('./src/wishlist/wishlist.route')
const userRoute = require('./src/user/user.route')
const sellerRoute = require('./src/seller/seller.route')
const productRoute = require('./src/product/product.route')
const orderRoute = require('./src/order/order.route')
// const adminRoute = require('./src/admin/admin.route')
const apiLogger = require('./logger/apiRoute')

require('dotenv').config({path: ".env"})

const errorController = require('./logger/error.controller')
const appError = require('./src/errorHandler/appError')

// const multer = require('multer')
// const multer1 = require('./src/util/aws')

const app = express()
app.use(express.json());
app.use(cookieParser)
connectDb();

app.use('/api/user', apiLogger,userRoute);
app.use('/api/seller', apiLogger,sellerRoute);
app.use('/api/product',apiLogger,productRoute)
app.use('/api/wishlist',apiLogger, wishlistRoute)
app.use('/api/order', apiLogger,orderRoute);
// app.use('/api/admin', apiLogger,adminRoute);
app.use(errorController)

app.all('*', (req, res, next) => {
    throw new appError(`Requested URL localhost:3000${req.path} not found!`, 404);

})


const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/apidocs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

swaggerUi.setup(swaggerDocument)

app.listen(3000, function(){
    console.log(`running on port ${3000}`)
})


