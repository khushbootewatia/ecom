const categoryModel = require("./category.model")

const getCategory = async(params) => {
    return await categoryModel.find(params)
}

const deleteCategory = async(params) => {
    return await categoryModel.findOneAndDelete(params)
}

module.exports = {
    getCategory,
    deleteCategory
}