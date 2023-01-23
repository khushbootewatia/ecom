const {User,TransientUser} = require("./user.model")
const getUser = async(params) => {
    return await User.findOne(params)
}
const updateUser = async(params,params2,params3) => {
    return await User.findOneAndUpdate(params,params2,params3)
}
const getTransisentUser = async(params) => {
    return await TransientUser.findOne(params)
}
const updateTransisentUser = async(params,p,w) => {
    return await TransientUser.findOneAndUpdate(params,p,w)
}
const removeTransisentUser = async(params) => {
    return await TransientUser.findOneAndDelete(params)
}
module.exports = {
    getUser,
    updateUser,
    getTransisentUser,
    updateTransisentUser,
    removeTransisentUser
}