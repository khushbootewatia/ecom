const router = require('express').Router();
const { wishlistAddItem, wishlistRemoveItem, getWishList } = require('../wishlist/wishlist.controller')


router.post('/addItem', wishlistAddItem);

router.delete('/removeItem', wishlistRemoveItem);

router.get('/getItems',getWishList)



module.exports = router;