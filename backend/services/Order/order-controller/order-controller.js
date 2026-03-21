const Order = require("../model/order");
const { ORDER_STATUSES, canTransitionStatus } = require("../utils/orderStatus");
const { publishOrderEvent } = require("../services/rabbitmqPublisher");
const Key = process.env.STRIPE_SECRET_KEY;
const stripe = require("stripe")(Key);

const health = async (req, res) => {
  return res.status(200).json({
    status: "ok",
    service: "order-service",
    timestamp: new Date().toISOString()
  });
};


const addOrder = async (req, res, next) => {
  try {
    const order = new Order({
      userId: req.userId,
      products: req.body.products,
      amount: req.body.amount,
      status: req.body.status || ORDER_STATUSES.PENDING,
    });

    await order.save();

    await publishOrderEvent("order.created", {
      orderId: order._id,
      userId: order.userId,
      amount: order.amount,
      status: order.status,
      itemsCount: order.products.length,
      createdAt: order.createdAt
    });

    return res.status(201).json(order);
  } catch (err) {
    console.error("addOrder error:", err);
    return res.status(500).json({ message: "Unable to create order" });
  }
};

const updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const nextStatus = req.body.status;

    if (req.userRole === "delivery" && nextStatus !== ORDER_STATUSES.DELIVERED) {
      return res.status(403).json({ message: "Delivery role can only mark orders as delivered" });
    }

    if (!canTransitionStatus(order.status, nextStatus)) {
      return res.status(400).json({
        message: `Invalid status transition from ${order.status} to ${nextStatus}`
      });
    }

    const previousStatus = order.status;
    order.status = nextStatus;

    const updatedOrder = await order.save();

    await publishOrderEvent("order.status.updated", {
      orderId: updatedOrder._id,
      userId: updatedOrder.userId,
      oldStatus: previousStatus,
      newStatus: updatedOrder.status,
      updatedAt: updatedOrder.updatedAt
    });

    return res.status(200).json(updatedOrder);
  } catch (err) {
    console.error("updateOrder error:", err);
    return res.status(500).json({ message: "Failed to update order" });
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({ message: "Order has been deleted" });
  } catch (err) {
    console.error("deleteOrder error:", err);
    return res.status(500).json({ message: "Failed to delete order" });
  }
};

const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (req.userRole === "buyer" && order.userId !== req.userId) {
      return res.status(403).json({ message: "Unauthorized to access this order" });
    }

    return res.status(200).json(order);
  } catch (err) {
    console.error("getOrder error:", err);
    return res.status(500).json({ message: "Failed to fetch order" });
  }
};


const getOrderByBuyersId = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (err) {
    console.error("getOrderByBuyersId error:", err);
    return res.status(500).json({ message: "Failed to fetch buyer order history" });
  }
};

const getAllOrder = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (err) {
    console.error("getAllOrder error:", err);
    return res.status(500).json({ message: "Failed to fetch orders" });
  }
};

const stripePay = async (req, res) => {
  if (!Key) {
    return res.status(500).json({ message: "Stripe secret key is not configured" });
  }

  try {
    const stripeRes = await stripe.charges.create({
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "LKR",
    });

    return res.status(200).json(stripeRes);
  } catch (stripeErr) {
    console.error("stripePay error:", stripeErr);
    return res.status(500).json({ message: "Stripe payment failed", details: stripeErr.message });
  }
};

const getDispatchedOrders = async (req, res) => {
  try {
    const orders = await Order.find({ status: ORDER_STATUSES.DISPATCHED }).sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (err) {
    console.error("getDispatchedOrders error:", err);
    return res.status(500).json({ error: "Failed to fetch dispatched orders" });
  }
};

exports.health = health;
exports.addOrder = addOrder;
exports.updateOrder = updateOrder;
exports.getOrder = getOrder;
exports.getAllOrder = getAllOrder;
exports.getOrderByBuyersId = getOrderByBuyersId;
exports.deleteOrder = deleteOrder;
exports.stripePay = stripePay;
exports.getDispatchedOrders = getDispatchedOrders;
