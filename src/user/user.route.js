const router = require('express').Router();
const { signUp, verifyOtp, signin, forgetPassword , resetPassword } = require('../user/user.controller');

router.post("/signup",signUp);
router.post("/signup/verify",verifyOtp);
router.post("/signin",signin);
router.post("/forgetPassword",forgetPassword);
router.post("/resetPassword/:token",resetPassword);
module.exports = router;
  
