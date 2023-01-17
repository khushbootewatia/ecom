const router = require('express').Router();
const { addItemInCart, removeItemInCart, updateQuantity } = require('./cart.controller');

// router.get("/category",getCategoryById);
router.post("/addItem",addItemInCart);
router.post("/removeItem",removeItemInCart);
router.post('/updateQuantity',updateQuantity);
module.exports = router;
  
