const joi = require('joi');
// const { AppError } = require("../../utils/errorHandler");;

const createproductSchema = joi.object().keys({
    productName: joi
        .string()
        .required()
        .error(new Error("Product name is not correct")),

    description: joi
        .string()
        .email()
        .required()
        .error(new Error("Please mention description")),

    totalQuantity: joi
        .number()
        .required()
        .error(new Error("Mention total Quantity")),

    category: joi
        .string()
        .required()
        .error(new Error("Mention category")),

    // productImage: joi
    //     .string()
    //     .required()
    //     .error(new Error("Product Image is required")),

    price: joi
        .number()
        .required()
        .error(new Error("Price is required"))
})

const validateCreateProductSchema = async (req, res, next) => {
    const { error } = createproductSchema.validate(req.body)
    if (!error)
        next();
    else {
        return res.json((`${error.message}`));
        // throw new AppError("Bad request", 400);
    }
}

module.exports = {
    validateCreateProductSchema
}