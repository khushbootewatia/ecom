const express = require('express')
const connectDb = require('./config/dbConnection')
const route = require('./src/user/user.route')
const sellerRoute = require('./src/seller/seller.route')
require('dotenv').config({path: ".env"})

const logger = require('./logger/logger')
const errorController = require('./logger/error.controller')
const appError = require('./src/errorHandler/appError')

console.log("errorController",errorController);
// logger.info('text info')
// logger.warn('text warn')
// logger.error('text error')


const app = express()
app.use(express.json());
connectDb();
app.use(errorController)

app.use('/api/user', route);
app.use('/api/seller', sellerRoute);

app.use('/', (req, res,next) => {
    logger.info(`localhost:3000${req.originalUrl} - ${req.method} - ${req.ip}`)
    next()
}, route)


app.all('*', (req, res, next) => {
    throw new appError(`Requested URL localhost:3000${req.path} not found!`, 404);

})



app.listen(3000, function(){
    console.log(`running on port ${3000}`)
})


