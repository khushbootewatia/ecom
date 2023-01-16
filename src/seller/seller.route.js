const router = require("express").Router();
const { validationMiddleware } = require("../../utils/middleware/joiValidator");
const {
  signUp,
  verifyOtp,
  signin,
  changePassword,
  forgetPasswordFunc,
  verifyChangedOtp,
} = require("../seller/seller.controller");
const { signInSchema } = require("./seller.validation");

// router.route("/signup").post(signUp);
router.post("/signup", signUp)
router.route("/verifyOtp").post(verifyOtp);
router.post("/signin",validationMiddleware(signInSchema), signin);
router.route("/changePassword").post(changePassword);
router.route("/forgetPasswordFunc").post(forgetPasswordFunc);
router.route("/verifyChangedOtp").post(verifyChangedOtp);
module.exports = router;
