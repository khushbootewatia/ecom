const express = require("express");
const {isAuthenticatedUser} = require("../middleware/auth")
console.log(isAuthenticatedUser)

const {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require('./order.controller');

const router = express.Router();

router.route("/new").post(isAuthenticatedUser, newOrder);


router.route("/me").get(isAuthenticatedUser, myOrders);

router.route("/allorders").get(getAllOrders);
router.route("/single/:id").get(isAuthenticatedUser, getSingleOrder);

router.route("/update/:id").put(isAuthenticatedUser, updateOrder)

router.route("/delete/:id").delete(isAuthenticatedUser,deleteOrder);

module.exports = router;