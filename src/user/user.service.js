const {User,TransientUser} = require("./user.model")
const getUser = async(params) => {
    return await User.findOne(params)
}
const updateUser = async(params) => {
    return await User.findOneAndUpdate(params)
}
const getTransisentUser = async(params) => {
    return await TransientUser.findOne(params)
}
const updateTransisentUser = async(params) => {
    return await TransientUser.findOneAndUpdate(params)
}
const removeTransisentUser = async(params) => {
    return await TransientUser.findOneandDelete(params)
}
module.exports = {
    getUser,
    updateUser,
    getTransisentUser,
    updateTransisentUser,
    removeTransisentUser
}