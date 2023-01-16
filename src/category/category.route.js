const router = require('express').Router();
const { getCategory, addCategory, removeCategory } = require('./category.controller');


router.get("/getCategory",getCategory);
router.post("/addCategory/:sellerId",addCategory);
router.post("/removeCategory/:sellerId",removeCategory);



module.exports = router;