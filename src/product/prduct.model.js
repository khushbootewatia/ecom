const { Schema, product } = require("mongoose");


const productSchema = Schema({
    productName: {
        type: String,
        required: true
    },

    productCategory: {
        type:String,
        required:true

    },

    productQuantity:{
        
    }



})