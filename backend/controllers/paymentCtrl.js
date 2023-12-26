const Payment = require("../models/paymentModel.js");
const User = require("../models/userModel.js");
const Order = require("../models/orderModel.js");
const LiqPay = require("../my_modules/liqpay.js");
const ErrorHandler = require('../utils/errorHandler.js');
const asyncHandler = require('../middlewares/asyncHandler.js');
const dotenv = require("dotenv").config({ path: "backend/config/config.env" });

const liqpay = new LiqPay(process.env.PUBLIC_LIQPAY_KEY, process.env.PRIVATE_LIQPAY_KEY);

const checkoutSession = asyncHandler(async (req, res, next) => {
     
     const user = await User.findById(req.user.id);
     if (!user) return next(new ErrorHandler("User not found"), 404);

     const order = await Order.findOne({ user: user._id });
     if (!order) return next(new ErrorHandler("Order not found"), 404);

     console.log(order.orderItems.map(item => item.name));

     const params = {
          version: "3",
          action: "pay",
          amount: order.totalPrice,  
          currency: 'UAH',  
          description: order.orderItems.map(item => item.name).join(", "),
          order_id: order._id.toString(),
          result_url: 'http://localhost:5173/',
          server_url: 'http://localhost:5173/',
          language: "uk",
     };

     const payment = await Payment.create({
          order_id: order._id.toString(),
          user_id: user._id,
          amount: order.totalPrice,
          description: params.description,
          currency: params.currency,
          payment_status: "shipping",
     });

     const form = liqpay.cnb_form(params);
     console.log(form);
     
     res.status(200).json({
          success: true,
          form,
          payment,
     });
});

module.exports = { checkoutSession };