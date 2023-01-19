const { AppError } = require('../../utils/errorHandler');
const CategoryModel = require('./category.model');

const getCategory = async (req, res) => {

    // const categoryId = req.query.categoryId
    CategoryModel.find({ categoryId: categoryId })
        .then(result => {
            res.status(200).send({ "message": "Success", data: result })
        }).catch(err => {
            res.status(400).send({ "message": "Something went wrong", error: err })
        })
}


// **********************************Add Category*******************************************

const addCategory = async (req, res,next) => {
    // const sellerId = req.decodedToken.id
  try {
    const { productId ,categoryName} = req.body;
    const categoryFound = await CategoryModel.findOne({categoryName})
    if(categoryFound){
        throw new AppError(addCategory,"Category already exist",409)
    }
    CategoryModel.create({ categoryName,
        productId })
        .then(result => {
            res.status(201).send({ message: "Category added Successfully", result: "result" })
        })
        .catch(err => {
          throw new AppError(addCategory,"Failed",424)
        })
  } catch (error) {
    error.reference = error.reference ? error.reference : "POST /category/add";

    next(error);
  }
    
}

//************************************Delete Category*************************************** */


const removeCategory = async (req, res) => {
    const { categoryId } = req.body;
try {
    CategoryModel.findOneAndDelete({ categoryId: categoryId })
    .then(result => {
        res.status(200).send({ message: "Category removed Successfully" })
    })
    .catch(err => {
        res.status(400).send({ message: "Failed", error: err })
    })
} catch (error) {
    
}
   
}



module.exports = { getCategory ,addCategory,removeCategory}