// const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config({path: ".env"})

// const connectDb = async() =>{
//     try{
//         await mongoose.connect(process.env.MONGODB_URL, {
//             useNewUrlParser: true,
//         })
//         console.log('mongodb is connected')
//     }
//     catch(error){
//         console.log(error)
//     }
// }


// module.exports = connectDb

mongoose.set('strictQuery', false);
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            // useCreateIndex: true,
            // useUnifiedTopology: true,
            // useFindAndModify: false
        });
        console.log('MongoDB Connected...')
    } catch (err) {
        console.error(err.message);
        //Exit process with failure.
        process.exit(1);
    }
};
module.exports = connectDB;



