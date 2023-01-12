const router = require("express").Router();
const {
  signUp,
  verifyOtp,
  signin,
  changePassword,
  forgetPasswordFunc,
  verifyChangedOtp
} = require("../user/user.controller");
const validate = require("../../utils/validation");

router.route("/signup").post(validate.validateCreateUserSchema, signUp);
router.route("/signup/verify").post(verifyOtp);
router.route("/signin").post(signin);
router.route("/changePassword").post(changePassword);
router.route("/forgetPasswordFunc").post(forgetPasswordFunc);
router.route("/verifyChangedOtp").post(verifyChangedOtp);
module.exports = router;
