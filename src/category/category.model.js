const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
 
   
    categoryId : {
        type : String
    },
    sellerId :{
        type : String
    },
    categoryName : {
        type : String
    }
  
})
module.exports = new mongoose.model("category", categorySchema);
