const express = require('express')
const connectDb = require('./config/dbConnection')
const route = require('./src/user/user.route')
const sellerRoute = require('./src/seller/seller.route')
require('dotenv').config({path: ".env"})

const logger = require('./logger/logger')

logger.info('text info')
logger.warn('text warn')
logger.error('text error')
// const port = 3000

const app = express()
app.use(express.json());
connectDb();

app.use('/api/user', route);
app.use('/api/seller', sellerRoute);

app.listen(process.env.PORT, function(){
    console.log(`running on port ${process.env.PORT}`)
})


