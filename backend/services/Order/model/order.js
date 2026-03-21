const mongoose = require("mongoose");

const STATUS_VALUES = ["pending", "confirmed", "dispatched", "delivered"];

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },
    products: [
      {
        productId: {
          type: String,
          required: true
        },
        name: {
          type: String,
          required: true
        },
        quantity: {
          type: Number,
          min: 1,
          default: 1,
        },
      },
    ],
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: STATUS_VALUES,
      default: "pending",
      index: true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);