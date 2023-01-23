const { Schema, model } = require('mongoose');



const userSchema = Schema({

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

const transientUserSchema = Schema(
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
module.exports.TransientUser = model('Otp', transientUserSchema);
