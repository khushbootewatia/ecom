const Order = require('./orders.model');

exports.newOrder = async (req, res) => {
    const {
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;
  
    const order = await Order.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });
  
    res.status(201).json({
      success: true,
      order,
    });
};

exports.myOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
  
    res.status(200).json({
      success: true,
      orders,
    });
};

exports.deleteOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.send("Order not found with this Id"); 
  }

  await order.remove();

  res.status(200).json({
    success: true,
  });
};
  

  