const router = require("express").Router();
const {
  signUp,
  verifyOtp,
  signin,
  changePassword,
  forgetPasswordFunc,
  verifyChangedOtp,
} = require("../seller/seller.controller");

router.route("/signup").post(signUp);
router.route("/verifyOtp").post(verifyOtp);
router.route("/signin").post(signin);
router.route("/changePassword").post(changePassword);
router.route("/forgetPasswordFunc").post(forgetPasswordFunc);
router.route("/verifyChangedOtp").post(verifyChangedOtp);
module.exports = router;
