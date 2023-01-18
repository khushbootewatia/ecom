const router = require("express").Router();
const {checkOut} = require("./checkout.controller")

router.route("/checkOut").post(checkOut)
module.exports = router