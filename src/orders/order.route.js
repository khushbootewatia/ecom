const express = require("express");
const {
  newOrder,
  myOrders,
  deleteOrder,
} = require("./order.controller");
const router = express.Router();

router.route("/order/new").post(newOrder);
router.route("/orders/me").get(myOrders);
router.route("/order/delete/:id").delete(deleteOrder);

module.exports = router;