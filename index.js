const express = require('express')
const connectDb = require('./config/dbConnection')
const route = require('./src/user/user.route')
require('dotenv').config({path: ".env"})

const logger = require('./logger/logger')
const errorController = require('./logger/error.controller')
const errorHandler = require('./src/errorHandler/appError')

logger.info('text info')
logger.warn('text warn')
logger.error('text error')


const app = express()
connectDb();

// app.use('/', route)

app.listen(process.env.PORT, function(){
    console.log(`running on port ${process.env.PORT}`)
})


