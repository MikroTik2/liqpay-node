const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
     order_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Order',
          required: true,
     },
     user_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
     },
     amount: {
          type: Number,
          required: true,
     },
     currency: {
          type: String,
          required: true,
     },
     description: {
          type: [String],
          required: true,
     },
     payment_status: {
          type: String,
          default: 'pending',
     },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
