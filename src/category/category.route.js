const router = require('express').Router();
const { getCategory, addCategory, removeCategory } = require('./category.controller');


router.get("/getAll",getCategory);
router.post("/add",addCategory);
router.post("/remove",removeCategory);



module.exports = router;