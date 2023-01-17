const express = require("express");
const {isAuthenticatedUser} = require("../middleware/auth")

const {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require('./order.controller');

const router = express.Router();

router.route("/new").post(isAuthenticatedUser,newOrder);

router.route(":id").get(isAuthenticatedUser,getSingleOrder);

router.route("/me").get(isAuthenticatedUser,myOrders);

router.route("/allorders").get(isAuthenticatedUser, getAllOrders);

router.route("/:id").put(isAuthenticatedUser, updateOrder).delete(isAuthenticatedUser, deleteOrder);

module.exports = router;