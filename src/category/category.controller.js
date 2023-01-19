const { AppError } = require('../../utils/errorHandler');
const CategoryModel = require('./category.model');
const { getSeller } = require("../seller/seller.service")


const getCategory = async (req, res) => {
   
    const categoryName = req.query.categoryName
    CategoryModel.find({ categoryName })
        .then(result => {
            res.status(200).json({ "message": "Success", data: result })
        }).catch(err => {
            res.status(400).json({ "message": "Something went wrong", error: err })
        })
}


// **********************************Add Category*******************************************

const addCategory = async (req, res, next) => {

    const sellerId = await getSeller(req.decodedToken._id)
    console.log(sellerId);
    try {
        const { productId, categoryName } = req.body;
        const categoryFound = await CategoryModel.findOne({ categoryName })
        if (categoryFound) {
            throw new AppError("addCategory", "Category already exist", 409)
        }
        CategoryModel.create({
            categoryName,
            productId, sellerId
        })
            .then(result => {
                res.status(201).json({ message: "Category added Successfully", result: "result" })
            })
            .catch(err => {
                throw new AppError(addCategory, "Failed", 424)
            })
    } catch (error) {
        error.reference = error.reference ? error.reference : "POST /category/add";

        next(error);
    }

}

//************************************Delete Category*************************************** */


const removeCategory = async (req, res) => {
    const { categoryId, categoryName } = req.body;
    try {
        categogryExistCheck = CategoryModel.findOneAndDelete({ categoryId, categoryName })

            .then(result => {
                res.status(200).json({ message: "Category removed Successfully" })
            })
            .catch(err => {
                res.status(400).json({ message: "Failed", error: err })
            })
    } catch (error) {
        error.reference = error.reference ? error.reference : "POST /category/remove";
    }

}



module.exports = { getCategory, addCategory, removeCategory }