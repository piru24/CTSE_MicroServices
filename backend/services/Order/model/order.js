const mongoose = require("mongoose");

const ORDER_STATUSES = ["pending", "confirmed", "dispatched", "delivered", "cancelled"];

const OrderSchema = new mongoose.Schema(
  {
    //userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userId:{
      type:String,
      required:true
    },
    products: [
      {
        productId: {
          type: String,
          required: true,
        },
        name:{
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],
    amount: { type: Number, required: true, min: 0 },
    //address: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true  },
    status: { type: String, enum: ORDER_STATUSES, default: "pending" },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);

module.exports = {
  Order,
  ORDER_STATUSES,
};