const router = require('express').Router();
const { signUp, verifyOtp,signin ,login} = require('../user/user.controller');

router.route('/signup')
    .post(signUp);
router.route('/signup/verify')
    .post(verifyOtp);
router.route('/signin')
    .post(signin);
module.exports = router;