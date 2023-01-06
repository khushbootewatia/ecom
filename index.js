const express = require('express')
// const mongoose = require('mongoose')
const connectDb = require('./config/dbConnection')
const route = require('./src/user/user.route')
require('dotenv').config({path: 'env.development'})

const logger = require('./logger/logger')

logger.info('text info')
logger.warn('text warn')
logger.error('text error')
// const port = 3000

const app = express()
connectDb();

// app.use('/', route)

app.listen(process.env.PORT, function(){
    console.log(`running on port ${process.env.PORT}`)
})


