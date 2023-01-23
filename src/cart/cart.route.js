const router = require('express').Router();
const { authentication } = require('../../utils/middleware/auth');
const { addItemInCart, removeItemInCart, updateQuantity } = require('./cart.controller');

router.post("/addItem",authentication,addItemInCart);
router.post("/removeItem",authentication,removeItemInCart);
router.post('/updateQuantity',authentication,updateQuantity);
module.exports = router;
  
