const { AppError } = require('../errorHandler')
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: ".env" })
const authentication = function (req, res, next) {
    try {
        const reference = "authentication"
        const bearerToken = req.headers.authorization
        if (typeof bearerToken == 'undefined')
            throw new AppError(reference,"token is missing", 403)
        let decodedToken = jwt.verify(bearerToken, process.env.KEY)
            if (!decodedToken) {
                throw new AppError(reference,"token invalid", 401)
            }
            req.decodedToken = decodedToken
            //TODO: check what is the role. if role seller - seller.findone else user - user.findone
            //TODO: if user doesn't exist, 
            //TODO: req.userId = user._id
            next();
    }
    catch (err) {
        next(err)
    }
}
module.exports = {
    authentication
}