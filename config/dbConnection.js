// const express = require('express')
const dotenv = require('dotenv').config();
const mongoose = require('mongoose')
console.log('dotenv', dotenv);
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
    console.log(process.env.MONGODB_URL)
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
        });
        console.log('MongoDB Connected...')
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};
module.exports = connectDB;



