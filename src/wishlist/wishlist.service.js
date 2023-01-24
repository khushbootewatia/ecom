const wishlistModel = require('../wishlist/wishlist.model')

const getWishListItem = async(params) => {
    return await wishlistModel.find(params)
}

const deleteWishlist = async(params) => {
    return await productSchema.findOneAndDelete(params)
}



module.exports = {
    getWishListItem,
    deleteWishlist   
}