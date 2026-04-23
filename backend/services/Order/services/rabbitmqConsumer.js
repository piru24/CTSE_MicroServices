const Order = require("../model/order");
const Key = process.env.STRIPE_SECRET_KEY;
const stripe = require("stripe")(Key);


const addOrder = async (req, res, next) => {
  let order;
  try {
    order = new Order({
      userId: req.userId,
      products: req.body.products,
      amount: req.body.amount,
      status: req.body.status,
    });
    await order.save();
  } catch (err) {
    console.log(err);
  }
  if (!order) {
    return res.status(500).json({ message: "Unable to add" });
  }
  return res.status(201).json(order);
};

const updateOrder = async (req, res, next) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: { status: req.body.status },
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
};

const getOrder = async (req, res, next) => {
  try {
    const orders = await Order.findById(req.params.id);
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
};


const getOrderByBuyersId = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.userId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getAllOrder = async (req, res, next) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
};
const stripePay = async (req, res) => {
  stripe.charges.create(
    {
      source: req.body.tokenId,

      amount: req.body.amount,

      currency: "LKR",
    },

    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json(stripeErr);
      } else {
        res.status(200).json(stripeRes);
      }
    }
  );
  
};

const getDispatchedOrders = async (req, res) => {
  try {
    const orders = await Order.find({ status: "dispatched" });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch dispatched orders" });
  }
};


exports.addOrder = addOrder;
exports.updateOrder = updateOrder;
exports.getOrder = getOrder;
exports.getAllOrder = getAllOrder;
exports.getOrderByBuyersId = getOrderByBuyersId;
exports.deleteOrder = deleteOrder;
exports.stripePay = stripePay;
exports.getDispatchedOrders = getDispatchedOrders;
