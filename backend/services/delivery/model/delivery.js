const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({

  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true
  },

  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  status: {
    type: String,
    default: "pending"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model('Delivery', deliverySchema);