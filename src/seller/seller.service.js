const Seller = require("./seller.model");

const getSeller = async(params) => {
    return await Seller.findOne(params)
}

module.exports = {
    getSeller
}