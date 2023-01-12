const mongoose = require('mongoose')
const {Schema} = require('mongoose')
const jwt = require('jsonwebtoken');


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
    isVerified:{
        type: Boolean,
        default: false
    },
    role:{
        type: String,
        default: "seller"
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

const forgetSellerSchema = new Schema({
    email:{
        type: String,
        required: true
    },
    otp:{
        type: String,
        required: true
    }
})

sellerSchema.methods.generateJWT = function () {
    const token = jwt.sign({
        _id: this._id,
        email: this.email
    }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
    return token
}


const Seller=  mongoose.model('Seller',sellerSchema);
const otpSeller = mongoose.model('otpSeller',otpSellerSchema)
const forgetSeller=  mongoose.model('forgetSeller',forgetSellerSchema);
module.exports = {Seller, otpSeller, forgetSeller}