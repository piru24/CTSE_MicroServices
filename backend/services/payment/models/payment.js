const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    transactionId: { type: String, required: true, unique: true },
    orderId: { type: String, default: null },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    amount: { type: Number, required: true },
    cardLast4: { type: String, required: true },
    status: { type: String, default: "SUCCESS" },
    emailNotification: { type: String, default: "FAIL" },
    smsNotification: { type: String, default: "FAIL" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
