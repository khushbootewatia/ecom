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
        mongoose.connect("mongodb+srv://practisenode:N7aT30Cq6NAQNUiP@cluster0.aeryvte.mongodb.net/ecommerce", {
            useNewUrlParser: true,
        });
        console.log('MongoDB Connected...')
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};
module.exports = connectDB;



