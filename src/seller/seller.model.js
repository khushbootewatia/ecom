const mongoose = require('mongoose')


const sellerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        unique: true,
        required:true
    },
    address:{
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    mobile: {
        type: Number,
        unique: true,
        required:true
    },

    account:{
        // type: [accountSchema]
        accountHolderName:{
        type: String,
        required: true
    },
    accountNumber: {
        type: String,
        required: true,
        unique: true
    },
    ifscCode:{
        type: String,
        required: true
    },
    bankName:{
        type: String,
        required: true
    }
    }

}, {timestamps: true})


const otpSellerSchema = Schema(
  {
      email: {
          type: String,
          required: true

      },
      otp: {
          type: String,
          required: true

      },
      createdAt: { type: Date, default: Date.now, index: { expires: 600 } }

      // After 60 seconds it deleted automatically from the database
  },
  {
      timestamps: true
  }
)



module.exports = mongoose.model('Seller',sellerSchema)
module.exports = mongoose.model('otpSeller',otpSellerSchema)