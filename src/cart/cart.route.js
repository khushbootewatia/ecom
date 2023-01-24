const router = require('express').Router();
const { authentication } = require('../../utils/middleware/auth');
const { addItemInCart, removeItemInCart, updateQuantity } = require('./cart.controller');

router.post("/addItem/:productId",authentication,addItemInCart);
router.post("/removeItem/:productId",authentication,removeItemInCart);
router.post("/updateQuantity/:productId",authentication,updateQuantity);
module.exports = router;
  
//todo : get items 