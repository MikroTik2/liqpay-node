const express = require("express");
const router = express.Router();
const { checkoutSession } = require("../controllers/paymentCtrl.js");
const { isAuthenticatedUser, authRoles } = require("../middlewares/auth.js");

// post
router.post("/payment/new", isAuthenticatedUser, checkoutSession);

// get


module.exports = router;