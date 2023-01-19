const Joi = require('joi');

const signUpSchema = (payload) => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(10).required(),
        email: Joi.string().email().lowercase().required(),
        password: Joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/).required(),
    })
    return schema.validate(payload)
}


const signInSchema = (payload) => {
    const schema = Joi.object({
        email: Joi.string().email().lowercase().required(),
        password: Joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/).required(),
    })
    return schema.validate(payload)
}

const verifyOtpSchema = (payload) => {
    const schema = Joi.object({
        email: Joi.string().required().email(),
        otp: Joi.number().required()
    })
    return schema.validate(payload)
}

const forgetPasswordSchema = (payload) => {
    const schema = Joi.object({
        email: Joi.string().required().email()
    })
    return schema.validate(payload)
}

const resetPasswordSchema = (payload) => {
    const schema = Joi.object({
        password: Joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/).required(),
    })
    return schema.validate(payload)
}


module.exports = {
    signUpSchema,
    signInSchema,
    verifyOtpSchema,
    forgetPasswordSchema,
    resetPasswordSchema
}