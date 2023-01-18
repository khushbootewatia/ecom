const Joi = require('joi');

const signUpSchema = (payload) =>{
const schema = Joi.object({
    name: Joi.string().min(2).max(10).required(),
    email: Joi.string().email().lowercase().required(),
    address: Joi.string().required(),
    password: Joi.string().required().min(6),
    mobile: Joi.string().length(10),
    accountHolderName: Joi.string().required(),
    accountNumber: Joi.string().required(),
    ifscCode: Joi.required(),
    bankName:Joi.string().required()
})
return schema.validate(payload)
}


const signInSchema = (payload) =>{
    const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required()
})
return schema.validate(payload)
}



const verifyOtpSchema = (payload) =>{
const schema = Joi.object({
    email: Joi.string().required().email(),
    otp: Joi.number().required()
})
return schema.validate(payload)
}


const changePasswordSchema = (payload) =>{
const schema = Joi.object({
    email: Joi.string().required().email(),
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().required().min(6)
})
return schema.validate(payload)
}


const forgetPasswordSchema = (payload) =>{
const schema = Joi.object({
    email: Joi.string().required().email()
})
return schema.validate(payload)
}


const verifyChangedOtpSchema = (payload) =>{
const schema = Joi.object({
    email: Joi.string().required().email(),
    otp: Joi.number().required(),
    newPassword: Joi.string().required().min(6)
})
return schema.validate(payload)
}

module.exports = {
    signUpSchema,
    signInSchema,
    verifyOtpSchema,
    changePasswordSchema,
    forgetPasswordSchema,
    verifyChangedOtpSchema
}