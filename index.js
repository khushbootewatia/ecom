const express = require('express')
const connectDb = require('./config/dbConnection')
const userRoute = require('./src/user/user.route')
const wishlistRoute = require('./src/wishlist/wishlist.route')
require('dotenv').config({path: ".env"})

const logger = require('./logger/logger')

logger.info('text info')
logger.warn('text warn')
logger.error('text error')
// const port = 3000

const app = express()
app.use(express.json());
connectDb();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/apidocs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// const swaggerUi = require("swagger-ui-express")
// 
// const swaggerDocument = require("./api/docs/swagger.json");
swaggerUi.setup(swaggerDocument)

app.use(express.json());
app.use('/api/user', userRoute)
app.use('/api/wishlist', wishlistRoute)

app.listen(process.env.PORT, function(){
    console.log(`running on port ${process.env.PORT}`)
})


