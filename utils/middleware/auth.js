const { AppError } = require('../errorHandler')
const jwt = require('jsonwebtoken');
const { Seller } = require('../../src/seller/seller.model');
const { User } = require('../../src/user/user.model');
require('dotenv').config({ path: ".env" })


const authentication = function (req, res, next) {
    try {
        const reference = "authentication"
        const bearerToken = req.headers.authorization

        if (typeof bearerToken == 'undefined')
            throw new AppError(reference, "token is missing", 403)

        let decodedToken = jwt.verify(bearerToken, process.env.KEY)
        if (!decodedToken) {
            throw new AppError(reference, "token invalid", 401)
        }
        req.decodedToken = decodedToken

        // function authorize(roles = ['user', 'seller']) {
        //     if (typeof roles === 'string') {
        //         roles = roles
        //         if (roles === 'seller') {
        const seller = Seller.findOne({ _id: decodedToken.id })
        if (seller) {
            role = 'seller'
            req.user = user
        } else {
            const user = User.findOne({ _id: decodedToken.id })
            if (user) {
                role = 'user'
                req.user = user
            }
            else {
                throw new AppError(reference,)
            }
        }
        next()

        // } 
        // else {
        //     User.findOne({User})
        // }
        // (async(req,res,next) => {
        //     if(roles.length && !roles.includes(req.role)) {
        //         throw new AppError(reference, "Unauthorized", 401)
        //     }
        //     next()
        // }}

        // }

        //TODO: check what is the role. if role seller - seller.findone else user - user.findone
        //TODO: if user doesn't exist, 
        //TODO: req.userId = user._id

        // next();
        // }
    }
    catch (err) {
        next(err)
    }
}


module.exports = {
    authentication
}