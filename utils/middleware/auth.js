const { AppError } = require('../errorHandler')
const jwt = require('jsonwebtoken');
const { Seller } = require('../../src/seller/seller.model');
const { User } = require('../../src/user/user.model');
require('dotenv').config({ path: ".env" })


const authentication = async function (req, res, next) {
    try {
        const reference = "authentication"
        const bearerToken = req.headers.authorization
        let decodedToken
        if (typeof bearerToken == 'undefined')
            throw new AppError(reference, "token is missing", 403)

        try {
            decodedToken = jwt.verify(bearerToken, process.env.KEY)
            // req.decodedToken = decodedToken
        }
        catch (err) {
            throw new AppError(reference, "token invalid", 401)
        }


        const seller = await Seller.findById(decodedToken.id)
        const user = await User.findById(decodedToken.id)
        if (seller)
            req.seller = { seller: seller, role: 'seller' }
        else if (user) {
            req.user = { user: user, role: 'seller' }
        }
        else {
            throw new AppError(reference, "either not a user nor a seller")
        }
        next()
    }
    catch (err) {
        next(err)
    }
}
module.exports = {
    authentication
}