const router = require('express').Router();
const { signUp, verifyOtp,signin , changePassword} = require('../user/user.controller');
const validate = require('../../utils/validation')

router.route('/signup')
    .post( validate.validateCreateUserSchema ,signUp);
router.route('/signup/verify')
    .post(verifyOtp);
router.route('/signin')
    .post(signin);
router.route('/changePassword')
    .post(changePassword);
module.exports = router;