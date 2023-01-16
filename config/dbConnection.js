// const express = require('express')
const mongoose = require('mongoose')

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



