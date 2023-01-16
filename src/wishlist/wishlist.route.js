const router = require('express').Router();
const { wishlistAddItem,wishlistRemoveItem,wishList} = require('../wishlist/wishlist.controller')


router.route('/addItem/:userId')
    .post(wishlistAddItem);

    router.route('/removeItem')
    .post(wishlistRemoveItem);

    router.route('/showItems')
    .get(wishList);

    module.exports = router;