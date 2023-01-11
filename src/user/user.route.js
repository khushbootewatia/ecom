const router = require('express').Router();
const { signUp, verifyOtp, signin, forgetPassword , resetPassword } = require('../user/user.controller');

router.route('/signup').post(signUp);
router.route('/signup/verify').post(verifyOtp);
router.route('/signin').post(signin);
router.route('/forgetPassword').post(forgetPassword);
router.route('/resetPassword/:token').post(resetPassword);
// router.route('/signout')
//     .post(signout);
module.exports = router;