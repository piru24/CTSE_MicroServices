const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Product"
  },
  rate: {
    type: Number,
    required: true
  },
  reviews: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Review", reviewSchema);
