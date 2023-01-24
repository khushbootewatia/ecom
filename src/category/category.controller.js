const { AppError } = require('../../utils/errorHandler');
const CategoryModel = require('./category.model');
const { search, oneSearch ,remove} = require("../category/category.service");



//********************************Get Category By Name********************************************* */

const getCategory = async (req, res, next) => {
    const categoryName = req.query.categoryName
    await search({ categoryName })
        .then(result => {
            res.status(200).json({ message: "Success", data: result })
        }).catch(err => {
            throw new AppError("getCategory", " Something Went Wrong ", 409)
        })
}


// **********************************Add Category*******************************************

const addCategory = async (req, res, next) => {

   
    const data = req.body
   
        data.sellerId = req.user.user._id
        const sellerId = data.sellerId
        try {
            const { categoryName } = req.body;
            const categoryFound = await oneSearch({ categoryName })
            if (categoryFound) {
                throw new AppError("addCategory", "Category already exist", 409)

            }
            await CategoryModel.create({ categoryName, sellerId })
                .then(result => {
                    res.status(201).json({ message: "Category added Successfully", result: result })
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


const removeCategory = async (req, res, next) => {
    try {
        const { categoryName } = req.body;
        const categoryFound = await oneSearch({ categoryName })
        if (!categoryFound) {
            throw new AppError("removeCategory", "No Category Found", 409)

        }
        await remove({ categoryName })

            .then(result => {
                res.status(200).json({ message: "Category removed Successfully" })
            })
            .catch(err => {
                throw new AppError("removeCategory", "Failed", 409)
            })
    } catch (error) {
        error.reference = error.reference ? error.reference : "POST /category/remove";
        next(error);
    }

}



module.exports = { getCategory, addCategory, removeCategory }