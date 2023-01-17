const router = require("express").Router();
const { validationMiddleware } = require("../../utils/middleware/joiValidator");
const {
  signUp,
  verifyOtp,
  signin,
  changePassword,
  forgetPassword,
  verifyChangedOtp,
} = require("../seller/seller.controller");
const {
  signInSchema,
  signUpSchema,
  verifyOtpSchema,
  changePasswordSchema,
  forgetPasswordSchema,
  verifyChangedOtpSchema,
} = require("./seller.validation");

// router.route("/signup").post(signUp);
router.post("/signup", validationMiddleware(signUpSchema), signUp);
router.post("/verifyOtp", validationMiddleware(verifyOtpSchema), verifyOtp);
router.post("/signin", validationMiddleware(signInSchema), signin);
router.post(
  "/changePassword",
  validationMiddleware(changePasswordSchema),
  changePassword
);
router.post(
  "/forgetPassword",
  validationMiddleware(forgetPasswordSchema),
  forgetPassword
);
router.post(
  "/verifyChangedOtp",
  validationMiddleware(verifyChangedOtpSchema),
  verifyChangedOtp
);
module.exports = router;
