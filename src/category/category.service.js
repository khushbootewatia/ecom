const CategoryModel = require("./category.model")

const search = async(params) => {
    return await CategoryModel.findOne(params)
}

const remove = async(params) => {
    return await CategoryModel.findOneAndDelete(params)
}
const oneSearch = async(params) => {
    return await CategoryModel.findOne(params)
}

module.exports = {
    search,
    remove,oneSearch
}