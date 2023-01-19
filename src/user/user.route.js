const router = require('express').Router();
const { signUp, verifyOtp, signin, forgetPassword , resetPassword } = require('../user/user.controller');
const {validationMiddleware} = require('../../utils/middleware/joiValidator');
const { signUpSchema, verifyOtpSchema, signInSchema, forgetPasswordSchema, resetPasswordSchema } = require('./user.validation');


router.post("/signup",validationMiddleware(signUpSchema),signUp);
router.post("/signup/verify",validationMiddleware(verifyOtpSchema),verifyOtp);
router.post("/signin",validationMiddleware(signInSchema),signin);
router.post("/forgetPassword",validationMiddleware(forgetPasswordSchema),forgetPassword);
router.post("/resetPassword/:token",validationMiddleware(resetPasswordSchema),resetPassword);
module.exports = router;
  
