const Order = require("../model/order");
const axios = require("axios");

const Key = process.env.STRIPE_SECRET_KEY;
const stripe = require("stripe")(Key);

// ✅ CREATE ORDER + CALL PAYMENT SERVICE
const addOrder = async (req, res) => {
  try {
    const order = new Order({
      userId: req.userId,
      products: req.body.products,
      amount: req.body.amount,
      status: req.body.status || "pending",
    });

    await order.save();

    // 🔥 CALL PAYMENT SERVICE
    try {
     await axios.post(
          "http://host.docker.internal:8500/payment/card",
        {
          tokenId: "tok_visa",
          amount: order.amount,
        },
        {
          headers: {
            Authorization: req.headers.authorization || "",
          },
        }
      );
    } catch (err) {
      console.error("Payment error:", err.response?.data || err.message);
    }
    return res.status(201).json(order);

  } catch (err) {
    console.error("ADD ORDER ERROR:", err);
    return res.status(500).json({ message: "Unable to add order" });
  }
};

// ✅ UPDATE ORDER
const updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: { status: req.body.status },
      },
      { new: true }
    );

    // 🔥 ONLY when status = dispatched → create delivery
    if (req.body.status === "dispatched") {
      try {
        console.log("🚀 Creating delivery for dispatched order...");

       await axios.post(
           "http://host.docker.internal:8300/delivery/create",
          {
            orderId: updatedOrder._id,
            userId: updatedOrder.userId,
            products: updatedOrder.products
          }
        );

        console.log("✅ Delivery created after dispatch");

      } catch (err) {
        console.error("❌ Delivery error:", err.response?.data || err.message);
      }
    }

    res.status(200).json(updatedOrder);

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ DELETE ORDER
const deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
};

// ✅ GET SINGLE ORDER
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json(err);
  }
};

// ✅ GET USER ORDERS
const getOrderByBuyersId = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
};

// ✅ GET ALL ORDERS
const getAllOrder = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
};

// ✅ STRIPE PAYMENT (optional endpoint)
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

// ✅ GET DISPATCHED ORDERS
const getDispatchedOrders = async (req, res) => {
  try {
    const orders = await Order.find({ status: "dispatched" });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch dispatched orders" });
  }
};

// EXPORTS
exports.addOrder = addOrder;
exports.updateOrder = updateOrder;
exports.getOrder = getOrder;
exports.getAllOrder = getAllOrder;
exports.getOrderByBuyersId = getOrderByBuyersId;
exports.deleteOrder = deleteOrder;
exports.stripePay = stripePay;
exports.getDispatchedOrders = getDispatchedOrders;