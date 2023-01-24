const router = require('express').Router();
const { authentication } = require('../../utils/middleware/auth');
const { addItemInCart, removeItemInCart, updateQuantity, getItems } = require('./cart.controller');

router.post("/addItem/:productId",authentication,addItemInCart);
router.post("/removeItem/:productId",authentication,removeItemInCart);
router.post("/updateQuantity/:productId",authentication,updateQuantity);
router.get("/getAll",authentication,getItems)
module.exports = router;
  
//TODO  : get items 