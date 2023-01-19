const {User} = require("./user.model");

const getUser = async(params) => {
    return await User.findOne(params)
}

module.exports = {
    getUser
}