const { AppError } = require('../errorHandler')
const jwt = require('jsonwebtoken');
const { Seller } = require('../../src/seller/seller.model');
const { User } = require('../../src/user/user.model');
const { getProduct } = require('../../src/product/product.service');
const { USER_ROLES } = require('../constants');
require('dotenv').config({ path: ".env" })


const authentication = async function (req, res, next) {
    try {
        const reference = "authentication"
        const bearerToken = req.headers.authorization
        let decodedToken
        if (typeof bearerToken == 'undefined')
            throw new AppError(reference, "token is missing", 403)
        try {
            const {role, id} = jwt.verify(bearerToken, process.env.KEY)
        }
        catch (err) {
            throw new AppError(reference, "token invalid", 401)
        }

        if (role == USER_ROLES.SELLER) {
            const seller = (await Seller.findById(id))
            if (!seller) {
                throw new AppError(reference, "seller not found", 400)
                //TODO: throw error
            }
            
            req.seller = seller
            // TODO: decide if you want to keep _id as plain string or mongoose Id
            
        }else if(role == USER_ROLES.USER){
            const user = await User.findById(id)
            if (!user) {
                throw new AppError(reference, "user not found", 400)
                //TODO: throw error
            }
            
            req.user = {...user, _id: user._id.toString()}
            // TODO: decide if you want to keep _id as plain string or mongoose Id

        }else{
            throw new AppError(reference, "either not a seller nor a user", 400)
            //TODO: throw respective error accordingly
        }

        next()
    }
    catch (err) {
        next(err)
    }
}

const authorization = async function (req, res, next) {
    try {
        if (!(await getProduct({ sellerId: req.seller.seller._id, _id: req.params.productId })))
            throw new AppError('Unauthorized', 401)
        next()
    }
    catch (error) {
        next(error)
    }
}

module.exports = {
    authentication,
    authorization
}