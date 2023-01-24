const { AppError } = require('../../utils/errorHandler');
const WishListModel = require('./wishlist.model');
// const User = require('../user/user.model');
// const { default: mongoose } = require('mongoose');
//*************************************ADD ITEM TO WIHLIST********************************* */

const wishlistAddItem = (req, res, next) => {
    try {
        const { userId, productId } = req.body;
        WishListModel.create({ userId, productId })
            .then(result => {
                res.status(201).send({ message: "Item added Success", result: result })
            })
            .catch(err => {
                throw new AppError(reference, "something went wrong", 400)
            })
    } catch(error){
        error.reference = error.reference ? error.reference : "POST/wishlist/add";
        next(error)
    }
}

//************************************REMOVE ITEM FROM WISHLIST**************************** */

const wishlistRemoveItem = (req, res, next) => {
    try {
        const reference = "wishlistRemoveItem"
        const { wishListItemId } = req.body;
        WishListModel.findOneAndDelete({ wishListItemId: wishListItemId })
            .then(result => {
                res.status(200).send({ message: "Item removed Successfully" })
            })
            .catch(err => {
                throw new AppError(reference, "something went wrong", 400)
            })

    } catch (error) {
        error.reference = error.reference ? error.reference : "DELETE/wishlist/remove"
        next(error)
    }
}

//***********************************GET WISHLIST ITEM************************************ */

const getWishList = (req, res, next) => {
    try {
        const reference = "getWishList"
        const wishListItems = WishListModel.find()
            .then(result => {
                res.status(200).send({ result: wishListItems })
            }).catch(err => {
                throw new AppError(reference, "something went wrong", 400)
            })
    }
    catch (error) {
        error.reference = error.reference ? error.reference : "GET/wishlist/getWishList";
        next(error)
    }
}


module.exports = {
    wishlistAddItem,
    wishlistRemoveItem,
    getWishList
}

