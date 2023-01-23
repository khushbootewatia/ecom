const { AppError } = require('../../utils/errorHandler');
const CategoryModel = require('./category.model');
const { search, oneSearch } = require("../category/category.service");
const { getSeller } = require('../seller/seller.service');


//********************************Get Category By Name********************************************* */

const getCategory = async (req, res,next) => {

    const categoryName = req.query.categoryName
    await search({ categoryName })
        .then(result => {
            res.status(200).json({ "message": "Success", data: result })
        }).catch(err => {
            throw new AppError("getCategory", " Something Went Wrong ", 409)
        })
}


// **********************************Add Category*******************************************

const addCategory = async (req, res, next) => {

    const j = JWT.verify(req.header.authorisation, process.env.KEY, 
        async function (err, decodedToken) {
        if (err) { /* handle token err */ }
        else {
            req.sellerId = decodedToken.id;   // Add to req object
            next();
        }
    });


try {
    const { categoryName } = req.body;
    const categoryFound = oneSearch({ categoryName })
    if (categoryFound) {
        throw new AppError("addCategory", "Category already exist", 409)
    }
    CategoryModel.create({
        categoryName,
        sellerId
    })
        .then(result => {
            res.status(201).json({ message: "Category added Successfully", result: "result" })
        })
        .catch(err => {
            throw new AppError("addCategory", "Failed", 424)
        })
        next();
} catch (error) {

    error.reference = error.reference ? error.reference : "POST /category/add";
  
    next(error);
}

}

// const sellerId = await getSeller(req.decodedToken._id)
// console.log(sellerId);



//************************************Delete Category*************************************** */


const removeCategory = async (req, res) => {
    const { categoryId, categoryName } = req.body;
    try {
        categogryExistCheck = remove({ categoryId, categoryName })

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