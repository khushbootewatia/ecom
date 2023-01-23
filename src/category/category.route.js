const router = require('express').Router();
const { authentication } = require('../../utils/middleware/auth');
const { getCategory, addCategory, removeCategory } = require('./category.controller');


router.get("/getAll",getCategory);
router.post("/add",authentication,addCategory);
router.post("/remove",authentication,removeCategory);



module.exports = router;