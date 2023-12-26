const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
     shippingInfo: {
          address: String,
          city: String,
          state: String,
          country: String,
          pincode: Number,
          phoneNo: Number,
     },
     orderItems: [
          {
               name: String,
               price: Number,
               priceTotal: Number,
               quantity: Number,
               images: [String],
                   
               product: {
                    type: mongoose.Schema.ObjectId,
                    ref: "Product",
                    required: true
               },
          },
     ],
     user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          required: true
     },
     paymentInfo: {
          id: String,
          status:  String,
     },
     paidAt: {
          type: Date,
          required: true
     },
     totalPrice: {
          type: Number,
          required: true,
          default: 0
     },
     orderStatus: {
          type: String,
          required: true,
          default: "Processing",
     },
     deliveredAt: Date,
     shippedAt: Date,
     createdAt: {
          type: Date,
          default: Date.now
     },
});

module.exports = mongoose.model("Order", orderSchema);