const Joi = require('joi');
const AppError = require('../../src/errorHandler/appError');

const signUpSchema = Joi.object({
    name: Joi.string().min(2).max(10).required(),
    email: Joi.string().email().lowercase().required(),
    address: Joi.string().required(),
    password: Joi.string().required().min(6),
    mobile: Joi.number().required(),
    accountHolderName: Joi.string().required(),
    accountNumber: Joi.string().required(),
    ifscCode: Joi.required(),
    bankName:Joi.string().required()
})

const signInSchema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required()
})

const verifyOtpSchema = Joi.object({
    email: Joi.string().required().email(),
    otp: Joi.number().required()
})

const changePasswordSchema = Joi.object({
    email: Joi.string().required().email(),
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().required().min(6)
})


const forgetPasswordSchema = Joi.object({
    email: Joi.string().required().email()
})


const verifyChangedOtpSchema = Joi.object({
    email: Joi.string().required().email(),
    otp: Joi.number().required(),
    newPassword: Joi.string().required().min(6)
})

module.exports = {
    signUpSchema,
    signInSchema,
    verifyOtpSchema,
    changePasswordSchema,
    forgetPasswordSchema,
    verifyChangedOtpSchema
}