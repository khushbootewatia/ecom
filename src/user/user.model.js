const { Schema, model } = require('mongoose');



const userSchema = Schema({
   userId:{
        type:String,
        trim : true,
        unique:true
   },
   
    email: {
        type: String,
        required: true,

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
module.exports.TransientUser= model('transient_user', transientUserSchema);
