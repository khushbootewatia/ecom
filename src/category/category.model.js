const mongoose = require("mongoose");
// const ObjectId = mongoose.Schema.Types.ObjectId
const categorySchema = mongoose.Schema({
 
   
    
    sellerId :{
        type : String
        // ref:'Seller'
    },
    categoryName : {
        type : String
    },
    productId :{
        type:String
    }
  
})
module.exports = new mongoose.model("category", categorySchema);
