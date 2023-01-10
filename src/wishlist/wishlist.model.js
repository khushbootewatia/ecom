const mongoose = require("mongoose");

const wishlistSchema = mongoose.Schema({
 
    userId : {
        type : String
    },
    categoryId : {
        type : String
    },
    productId : {
        type : String
    }
  
})
module.exports = new mongoose.model("wishlist", wishlistSchema);