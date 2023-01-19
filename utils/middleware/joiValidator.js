const { AppError } = require("../errorHandler")
module.exports.validationMiddleware = (validator)=> (req,res,next)=>{
    try {
        const reference = "validationMiddleware"
        const {error} = validator(req.body)
        if (error) {
            throw new AppError(reference, error.details?.[0]?.message.replace('"', ""), 412)
        }
        next()
    } catch (error) {
        return next(error)
    }
}