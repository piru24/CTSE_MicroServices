const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    require: true,
  },
  weight: {
    type: Number,
    require: true,
  },
  upload_date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: "user", // or 'Seller' if you have a separate seller model
    required: true,
  },
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: "user", // or 'Seller' if you have a separate seller model
    required: true,
  },
});

module.exports = mongoose.model("Productss", productSchema);
