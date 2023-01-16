const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
 
   
    categoryId : {
        type : String
    },
    sellerId :{
        
    },
    categoryName : {
        type : String
    }
  
})
module.exports = new mongoose.model("category", categorySchema);