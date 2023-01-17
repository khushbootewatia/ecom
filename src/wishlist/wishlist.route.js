const router = require('express').Router();
const { wishlistAddItem, wishlistRemoveItem, wishList } = require('../wishlist/wishlist.controller')


router.post('/addItem', wishlistAddItem);

router.post('/removeItem', wishlistRemoveItem);

router.get('/getItems',wishList)



module.exports = router;