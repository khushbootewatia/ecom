const { Schema, model} = require('mongoose');

const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetPasswordToken: String,

    resetPasswordExpires: Date,
    role: {
        type: String,
        default: "User",
      },
    address: {
        shippingAddress: {
            state: {
                type: String
            },
            zipcode: {
                type: String
            },
            city: {
                type: String
            },
            street: {
                type: String
            },
            landmark: {
                type: String
            },
            houseNumber: {
                type: String
            },


        },
        billingAddress: {
            state: {
                type: String
            },
            zipcode: {
                type: String
            },
            city: {
                type: String
            },
            street: {
                type: String
            },
            landmark: {
                type: String
            },
            houseNumber: {
                type: String
            },


        }
    }

}, { timestamps: true });

const transientUserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true

        },
        otpHash: {
            type: String,
            required: true


        },

        // After 60 seconds it deleted automatically from the database
    },
    {
        timestamps: true
    }
)




module.exports.User = model('User', userSchema);
module.exports.TransientUser = model('transient_users', transientUserSchema);
