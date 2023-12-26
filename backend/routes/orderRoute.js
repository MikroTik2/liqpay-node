const express = require("express");
const router = express.Router();
const { createOrder, getSingleOrderDetails, getAllOrders, getMyOrders, updateOrder, deleteOrder } = require("../controllers/orderCtrl.js");
const { isAuthenticatedUser, authRoles } = require("../middlewares/auth.js");

// post
router.post("/order/new", isAuthenticatedUser, createOrder);

// get
router.get("/admin/orders", isAuthenticatedUser, authRoles("admin"), getAllOrders);
router.get("/orders/me", isAuthenticatedUser, getMyOrders);
router.get("/orders/:id", getSingleOrderDetails);

// put
router.put("/admin/order/:id", isAuthenticatedUser, authRoles("admin"), updateOrder);

// delete
router.delete("/admin/order/:id", isAuthenticatedUser, authRoles("admin"), deleteOrder);

module.exports = router;