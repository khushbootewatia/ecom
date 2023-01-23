const WishListModel = require('./wishlist.model');
// const User = require('../user/user.model');
// const { default: mongoose } = require('mongoose');
//*************************************ADD ITEM TO WIHLIST********************************* */

module.exports.wishlistAddItem =  (req, res) => {
    const { userId, categoryId, productId } = req.body;
    WishListModel.create({ userId,categoryId, productId,wishListItemId})
        .then(result => {
            res.status(201).send({ message: "Item added Success", result: "result" })
        })
        .catch(err => {
            res.status(400).send({ message: "Failed", error: err })
        })
}

//************************************REMOVE ITEM FROM WISHLIST**************************** */

module.exports.wishlistRemoveItem = (req, res) => {
    const { wishListItemId } = req.body;

    WishListModel.findOneAndDelete({ wishListItemId : wishListItemId })
        .then(result => {
            res.status(200).send({ message: "Item removed Successfully" })
        })
        .catch(err => {
            res.status(400).send({ message: "Failed", error: err })
        })
}

//***********************************GET WISHLIST ITEM************************************ */

module.exports.wishList=(req, res) => {
   
    
    const wishListItems=WishListModel.find()
        .then(result => {
            res.status(200).send({wishListItems:result})
        }).catch(err => {
            res.status(400).send({ message: "Something went wrong", error: err })
        })
}

