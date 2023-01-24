const { AppError } = require('../../utils/errorHandler');
const WishListModel = require('./wishlist.model');
const {getWishListItem, deleteWishlist} = require('../wishlist/wishlist.service')
// const User = require('../user/user.model');
// const { default: mongoose } = require('mongoose');

//*************************************ADD ITEM TO WIHLIST********************************* */

const wishlistAddItem = async (req, res, next) => {
    try {
        const { userId, productId } = req.body;
        const result = await WishListModel.create({ userId, productId })
        res.status(201).send({ message: "Item added Success", result: result })
    }
    catch (error) {
        error.reference = error.reference ? error.reference : "POST/wishlist/add";
        next(error)
    }
}

//************************************REMOVE ITEM FROM WISHLIST**************************** */

const wishlistRemoveItem = (req, res, next) => {
    try {
        const reference = "wishlistRemoveItem"
        const { wishListItemId } = req.body;
        WishListModel.deleteWishlist({ wishListItemId: wishListItemId })
        const result = res.status(200).send({ message: "Item removed Successfully" })
    } 
    catch (error) {
        error.reference = error.reference ? error.reference : "DELETE/wishlist/remove"
        next(error)
    }
}

//***********************************GET WISHLIST ITEM************************************ */

const getWishList = (req, res, next) => {
    try {
        const reference = "getWishList"
        const wishListItems = WishListModel.getWishListItem
        const result = res.status(200).send({ result: wishListItems })
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

