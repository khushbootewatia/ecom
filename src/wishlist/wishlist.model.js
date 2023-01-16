const mongoose = require("mongoose");
const { User } = require("../user/user.model");
// const user = mongoose.model('User', User);

const wishlistSchema = mongoose.Schema({

    userId: {
        type: Usmongoose.Schema.Types.ObjectId, ref: 'User' 
        
    },
    categoryId: {
        type: String
    },
    productId: {
        type: String
    },
    wishlistItemsId: {
        type: String
    }

})
module.exports = new mongoose.model("wishlist", wishlistSchema);