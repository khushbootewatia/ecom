const router = require('express').Router();
const { signUp, verifyOtp, signin, changePassword} = require('../seller/seller.controller');

router.route('/signup')
    .post(signUp);
router.route('/verifyOtp')
    .post(verifyOtp);
router.route('/signin')
    .post(signin);
router.route('/changePassword')
    .post(changePassword);
module.exports = router;