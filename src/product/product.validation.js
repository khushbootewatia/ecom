const Joi = require('joi');

const validateProductSchema = (payload) => {
    const schema = Joi.object({
        productName: Joi.string().min(2).max(10).required(),
        description: Joi.string().required(),
        totalQuantity: Joi.number().required(),
        // category: Joi.string().required(),
        productPrice: Joi.number().required(),
        productImage: Joi.array()
    })
    return schema.validate(payload)
}


module.exports = {
    validateProductSchema
}