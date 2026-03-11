const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    //userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userId:{
      type:String,
      require:true
    },
    products: [
      {
        productId: {
          type: String,
        },
        name:{
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    amount: { type: Number, required: true },
    //address: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true  },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);