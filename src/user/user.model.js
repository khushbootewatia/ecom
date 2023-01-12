const { Schema, model } = require('mongoose');
const jwt = require('jsonwebtoken');


const userSchema = Schema({
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

}, { timestamps: true });

const transientUserSchema = Schema(
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

const forgetUserSchema = new Schema({
    email:{
        type: String,
        required: true
    },
    otp:{
        type: String,
        required: true
    }
})


userSchema.methods.generateJWT = function () {
    const token = jwt.sign({
        _id: this._id,
        email: this.email
    }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
    return token
}

module.exports.User = model('User', userSchema);
module.exports.TransientUser= model('transient_user', transientUserSchema);
module.exports.forgetUser =  model('forgetUser',forgetUserSchema);
