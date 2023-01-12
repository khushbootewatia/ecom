const router = require('express').Router();
const { wishlistAddItem,wishlistRemoveItem,wishList} = require('../wishlist/wishlist.controller')


router.route('/addItem')
    .post(wishlistAddItem);

    router.route('/removeItem')
    .post(wishlistRemoveItem);

    router.route('/showItems')
    .get(wishList);

    module.exports = router;