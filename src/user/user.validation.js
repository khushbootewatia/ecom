const joi = require('joi');
const { AppError } = require("../../utils/errorHandler");;

const createUserSchema = joi.object().keys({
    name: joi
        .string()
        .required()
        .error(new Error("Name field is empty or incorrect")),

    email: joi
        .string()
        .email()
        .required()
        .error(new Error("Email is not correct")),

    password: joi
        .string()
        .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
        .error(new Error("Password should contain one Capital letter, one special character and alphanumeric"))
})

const validateCreateUserSchema = async (req, res, next) => {
    const {error} = createUserSchema.validate(req.body)
    if(!error)
    next();
    else {
        return res.json((`${error.message}`));
        // throw new AppError("Bad request", 400);
    }
}

module.exports = {
    validateCreateUserSchema
}