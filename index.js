const express = require('express')
const mongoose = require('mongoose')
const route = require('./src/User-Panel/route')
// const port = 3000

const app = express()

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true
})
.then(() =>console.log('MongoDb is connected'))
.catch(err => console.log(err))

app.use('/', route)

app.listen(process.env.PORT, function(){
    console.log(`running on port ${process.env.PORT}`)
})


