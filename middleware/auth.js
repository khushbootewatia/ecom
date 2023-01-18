const AppError = require('../errorHandler/appError')
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: ".env" })


const authentic = function (req, res, next) {
    try {
        const bearerToken = req.headers.authorization
        if (typeof (bearerToken) == 'undefined')
            throw new AppError("token is missing", 403)

        let decodedToken = jwt.verify(bearerToken, process.env.KEY, function (error, decodedToken) {
            if (!decodedToken) {
                throw new AppError("token invalid", 401)
            }
            req.decodedToken = decodedToken
            next();
        })
    }
    catch (err) {
        next(err)
        // res.send({status: false, Error:err.message})
    }
}


module.exports = {
    authentic
}