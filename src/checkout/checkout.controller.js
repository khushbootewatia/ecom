const bcrypt = require("bcryptjs");
const { AppError } = require("../../utils/errorHandler");
const CartModel = require("../cart/cart.model");
const { User } = require("../user/user.model");

const checkOut = async (req, res, next) => {
  try {
    const reference = "checkOut";
    const userId = "63c7acaa105c649b83f2f01f";
    const user = await User.findOne({ _id: userId });
    if (user.homeAddress.houseNo == null || user.homeAddress.area == null || user.homeAddress.city == null || user.homeAddress.state == null || user.homeAddress.country == null){
        if (!(req.body.homeAddress)){
            throw new AppError(reference,"homeAddress is required",400)
        }
    }
    if (user.homeAddress.houseNo == null) {
      if (!req.body.homeAddress.houseNo) {
        throw new AppError(reference, "House No is required", 400);
      } else {
        const { houseNo } = req.body.homeAddress;
        user.homeAddress.houseNo = houseNo;
      }
    }
    if (user.homeAddress.area == null) {
      if (!req.body.homeAddress.area) {
        throw new AppError(reference, "Area is required", 400);
      } else {
        const { area } = req.body.homeAddress;
        user.homeAddress.area = area;
      }
    }
    if (user.homeAddress.city == null) {
      if (!req.body.homeAddress.city) {
        throw new AppError(reference, "City is required", 400);
      } else {
        const { city } = req.body.homeAddress;
        user.homeAddress.city = city;
      }
    }
    if (user.homeAddress.state == null) {
      if (!req.body.homeAddress.state) {
        throw new AppError(reference, "state is required", 400);
      } else {
        const { state } = req.body.homeAddress;
        user.homeAddress.state = state;
      }
    }
    if (user.homeAddress.country == null) {
      if (!req.body.homeAddress.country) {
        throw new AppError(reference, "country is required", 400);
      } else {
        const { country } = req.body.homeAddress;
        user.homeAddress.country = country;
      }
    }
    await user.save(function(err,result){
        if (err){
            console.log(err);
        }
        res.json("Saved successfully")
    });
  } catch (error) {
    error.reference = error.reference ? error.reference : "POST /checkOut";
    next(error);
  }
};

module.exports = {
  checkOut,
};
