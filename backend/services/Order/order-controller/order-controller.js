const { Order, ORDER_STATUSES } = require("../model/order");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY || "");

const {
  publishOrderCreated,
  publishOrderStatusUpdated,
  isRabbitMQConnected,
} = require("../services/rabbitmqPublisher");
const { validateProductsAgainstCatalog, PRODUCT_SERVICE_URL } = require("../services/productServiceClient");
const mongoose = require("mongoose");

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const addOrder = asyncHandler(async (req, res) => {
  const validatedProducts = await validateProductsAgainstCatalog(
    req.body.products,
    req.headers.authorization,
    req.headers.cookie
  );

  const order = new Order({
    userId: req.userId,
    products: validatedProducts,
    amount: req.body.amount,
    status: req.body.status || "pending",
  });

  await order.save();

  await publishOrderCreated({
    eventName: "order.created",
    orderId: order._id.toString(),
    userId: order.userId,
    products: order.products,
    amount: order.amount,
    status: order.status,
    occurredAt: new Date().toISOString(),
  });

  return res.status(201).json(order);
});

const updateOrderStatus = asyncHandler(async (req, res) => {

  const updatedOrder = await Order.findByIdAndUpdate(
    req.params.id,
    {
      $set: { status: req.body.status },
    },
    { new: true }
  );

  if (!updatedOrder) {
    return res.status(404).json({ message: "Order not found" });
  }

  await publishOrderStatusUpdated({
    eventName: "order.status.updated",
    orderId: updatedOrder._id.toString(),
    userId: updatedOrder.userId,
    products: updatedOrder.products,
    amount: updatedOrder.amount,
    status: updatedOrder.status,
    occurredAt: new Date().toISOString(),
  });

  return res.status(200).json(updatedOrder);
});

// Backward compatibility for existing route handlers
const updateOrder = updateOrderStatus;

const deleteOrder = asyncHandler(async (req, res) => {
  const deletedOrder = await Order.findByIdAndDelete(req.params.id);

  if (!deletedOrder) {
    return res.status(404).json({ message: "Order not found" });
  }

  return res.status(200).json({ message: "Order deleted" });
});

const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // Buyers can only access their own orders.
  if (req.userRole === "buyer" && order.userId !== req.userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  return res.status(200).json(order);
});

const getOrderByBuyersId = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
  return res.status(200).json(orders);
});

const getAllOrder = asyncHandler(async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  return res.status(200).json(orders);
});

const stripePay = asyncHandler(async (req, res) => {

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(503).json({ message: "Payment provider unavailable" });
  }

  const stripeResponse = await stripe.charges.create({
    source: req.body.tokenId,
    amount: req.body.amount,
    currency: "LKR",
  });

  return res.status(200).json(stripeResponse);

});

const getDispatchedOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ status: "dispatched" }).sort({ createdAt: -1 });
  return res.status(200).json(orders);
});

const health = (req, res) => {
  return res.status(200).json({
    service: "order-service",
    status: "ok",
    allowedStatuses: ORDER_STATUSES,
    timestamp: new Date().toISOString(),
  });
};

const readiness = (req, res) => {
  const mongoReady = mongoose.connection.readyState === 1;
  const rabbitReady = isRabbitMQConnected();
  const productServiceConfigured = Boolean(PRODUCT_SERVICE_URL);

  const ready = mongoReady && productServiceConfigured;

  return res.status(ready ? 200 : 503).json({
    service: "order-service",
    status: ready ? "ready" : "not-ready",
    dependencies: {
      mongodb: mongoReady ? "up" : "down",
      rabbitmqPublisher: rabbitReady ? "up" : "degraded",
      productService: productServiceConfigured ? "configured" : "missing-config",
    },
    timestamp: new Date().toISOString(),
  });
};

exports.addOrder = addOrder;
exports.updateOrder = updateOrder;
exports.updateOrderStatus = updateOrderStatus;
exports.getOrder = getOrder;
exports.getAllOrder = getAllOrder;
exports.getOrderByBuyersId = getOrderByBuyersId;
exports.deleteOrder = deleteOrder;
exports.stripePay = stripePay;
exports.getDispatchedOrders = getDispatchedOrders;
exports.health = health;
exports.readiness = readiness;