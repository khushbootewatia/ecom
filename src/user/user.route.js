const router = require('express').Router();
const { signUp, verifyOtp,signin , changePassword} = require('../user/user.controller');

router.route('/signup')
    .post(signUp);
router.route('/signup/verify')
    .post(verifyOtp);
router.route('/signin')
    .post(signin);
router.route('/changePassword')
    .post(changePassword);
module.exports = router;