const userModel = require("./user.model")
const TransientUserModel = require('./user.model')

const getUser = async(params) => {
    return await userModel.findOne(params)
}

const updateUser = async(params) => {
    return await userModel.findOneAndUpdate(params)
}

const getTransisentUser = async(params) => {
    return await TransientUserModel.findOne(params)
}

const updateTransisentUser = async(params) => {
    return await TransientUserModel.findOneAndUpdate(params)
}

const removeTransisentUser = async(params) => {
    return await TransientUserModel.findOneandDelete(params)
}

module.exports = {
    getUser,
    updateUser,
    getTransisentUser,
    updateTransisentUser,
    removeTransisentUser
}