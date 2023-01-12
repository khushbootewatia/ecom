<<<<<<< HEAD
=======
const joi = require('joi');
const AppError = require('../src/errorHandler/appError');

const createUserSchema = joi.object().keys({
    name: joi
        .string()
        .required(),

    email: joi
        .string()
        .email()
        .required(),

    password: joi
        .string()
        .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)

})

const validateCreateUserSchema = async (req, res, next) => {
    const {error} = createUserSchema.validate(req.body)
    if(!error)
    next();
    else {
        throw new AppError("Bad request", 400)
    }

}

module.exports = {
    validateCreateUserSchema
}

>>>>>>> develop
