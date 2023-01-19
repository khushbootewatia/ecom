const router = require('express').Router();
const { signUp, verifyOtp, signIn, forgetPassword , resetPassword } = require('../user/user.controller');
const {validationMiddleware} = require('../../utils/middleware/joiValidator');
const { signUpSchema, verifyOtpSchema, signInSchema, forgetPasswordSchema, resetPasswordSchema } = require('./user.validation');


router.post("/signup",validationMiddleware(signUpSchema),signUp);
router.post("/signup/verify",validationMiddleware(verifyOtpSchema),verifyOtp);
router.post("/signin",validationMiddleware(signInSchema),signIn);
router.post("/forgetPassword",validationMiddleware(forgetPasswordSchema),forgetPassword);
router.post("/resetPassword/:token",validationMiddleware(resetPasswordSchema),resetPassword);
module.exports = router;