const mongoose = require('mongoose');

const acceptedDeliverySchema  = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: 'Order' // optional, assuming you're referencing Delivery model
      },
      driverId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // if you have a User/Driver model
      },
      status: {
        type: String,
        default: "On the way"
      },
      acceptedAt: {
        type: Date,
        default: Date.now
      }
}
);

module.exports = mongoose.model('AcceptedDelivery', acceptedDeliverySchema);
