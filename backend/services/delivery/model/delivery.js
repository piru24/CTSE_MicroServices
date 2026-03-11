const mongoose = require('mongoose');

const deliverySchema  = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
      },
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // User model
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

module.exports = mongoose.model('Delivery', deliverySchema);
