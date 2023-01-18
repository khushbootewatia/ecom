const router = require("express").Router();
const {checkOut} = require("./checkout.controller")
router.post("/checkOut",checkOut)
module.exports = router