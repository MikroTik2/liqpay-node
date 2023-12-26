const asyncHandler = require("../middlewares/asyncHandler.js");
const sendEmail = require("../utils/sendEmail.js");
const Order = require("../models/orderModel.js");
const User = require("../models/userModel.js");
const Product = require("../models/productModel.js");
const ErrorHandler = require("../middlewares/error.js");

async function updateStock(id, quantity) {
     const product = await Product.findById(id);
     product.stock -= quantity;

     await product.save({ validateBeforeSave: false });
};

// create new order
const createOrder = asyncHandler(async (req, res, next) => {

     const { shippingInfo, orderItems, paymentInfo, totalPrice } = req.body;
     const user = await User.findById(req.user.id);

     if (!user) return next(new ErrorHandler("User not found", 404));
     if (user.cart.length === 0);

     const order = await Order.create({
          shippingInfo,
          orderItems,
          paymentInfo,
          totalPrice,

          orderItems: user.cart.map(item => ({

               product: item.product,
               name: item.name,
               images: item.imagesUrl,
               quantity: item.quantity,
               price: item.price,
               priceTotal: item.priceTotal,

          })),

          totalPrice: user.totalPrice,
          paidAt: Date.now(),
          user: req.user._id,
     });

     const emailBody = `

          <div style="font-family: Arial, sans-serif; padding: 20px;">
               <h2>Новый заказ!</h2>

               <h3>Информация о заказчике:</h3>
               <p><strong>Заказчик:</strong> ${user.name}</p>

               <hr>

               <h3>Товары в заказе:</h3>

                    ${order.orderItems.map(item => `

                         <div style="display: grid;">
                              <span> <strong>Название товара:</strong> ${item.name} </span>
                              <img style="width: 150px; height: 150px" src="${item.images[0]}"  alt="photo" />
                              <span> <strong>Количество:</strong> ${item.quantity} </span>
                              <span> <strong>Цена:</strong> ${item.price} </span>
                              <span> <strong>Цена в количестве:</strong> ${item.priceTotal} </span>
                         </div>

                         <hr>

                    
                    `)}

               <p> <strong>Итоговая стоимость заказа:</strong> ${order.totalPrice}</p>
          </div>

     `;

     sendEmail({
          email: process.env.EMAIL_USER,
          subject: "Новый заказ",
          html: emailBody,
     });

     user.cart = [];
     user.totalPrice = 0;
     await user.save();

     res.status(201).json(order);
     
});

// get single order details
const getSingleOrderDetails = asyncHandler(async (req, res, next) => {
     const order = await Order.findById(req.params.id).populate("user", "name email");
     if (!order) next(new ErrorHandler("Order not found"), 404);

     res.status(200).json({
          success: true,
          order,
     });
});

// get logged in user orders 
const getMyOrders = asyncHandler(async (req, res, next) => {
     const orders = await Order.find({ user: req.user._id });
     if (!orders) return next(new ErrorHandler("Order not found", 404));

     res.status(200).json({
          success: true,
          orders,
     });
});

const getAllOrders = asyncHandler(async (req, res, next) => {
     const orders = await Order.find();
     if (!orders) return next(new ErrorHandler("Order not found", 404));

     let totalAmount = 0;

     orders.forEach((order) => {
          totalAmount += order.totalPrice;
     });

     res.status(200).json({
          success: true,
          orders,
          totalAmount,
     });
});

// update order
const updateOrder = asyncHandler(async (req, res, next) => {
     const order = await Order.findById(req.params.id);
     if (!order) return next(new ErrorHandler("Order not found", 404));

     if (order.orderStatus === "Delivered") {
          return next(new ErrorHandler("Already Delivered", 400));
     };

     if (req.body.status === "Shipped") {
          order.shippedAt = Date.now();
          order.orderItems.forEach(async (i) => {
               await updateStock(i.product, i.quantity)
          });
     };

     order.orderStatus = req.body.status;

     if (req.body.status === "Delivered") {
          order.deliveredAt = Date.now();
     };

     await order.save({ validateBeforeSave: false });

     res.status(200).json({
          success: true
     });

});

// delete order
const deleteOrder = asyncHandler(async (req, res, next) => {
     
     const order = await Order.findByIdAndDelete(req.params.id);
     if (!order) return next(new ErrorHandler("Order Not Found", 404));

     res.status(200).json({
          success: true,
          order,
     });
});

module.exports = { createOrder, getSingleOrderDetails, getMyOrders, getAllOrders, updateOrder, deleteOrder };