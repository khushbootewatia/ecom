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

        try{
            decodedToken = jwt.verify(bearerToken, process.env.KEY)
            req.decodedToken = decodedToken
        }
        catch(err){
            throw new AppError(reference, "token invalid", 401)
        }

        
        const seller = await Seller.findOne({ _id: decodedToken.id })
        
        if (seller) {
            req.user = { user: seller, role: 'seller' }
        } else {
            const user = await User.findOne({ _id: decodedToken.id })
            if (user) {
                req.user = { user: user, role: 'user' }
            }
            else {
                throw new AppError(reference,)
            }
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