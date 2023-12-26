const express = require("express");
const router = express.Router();
const { createProduct, getCartUser, createProductReview, addToCartUser, getAllProducts, getProductDetail, getAdminProducts, getAllReviews, getProducts, updateProduct, deleteReview, deleteProduct } = require("../controllers/productCtrl.js");
const { isAuthenticatedUser, authRoles } = require("../middlewares/auth.js");

// post
router.post("/admin/product/new", isAuthenticatedUser, authRoles("admin"), createProduct);
router.post("/admin/review", isAuthenticatedUser, createProductReview);

// get
router.get("/admin/products/all", isAuthenticatedUser, authRoles("admin"), getAdminProducts);
router.get("/admin/review", isAuthenticatedUser, authRoles("admin"), getAllReviews);
router.get("/products/all", getProducts);
router.get("/products", getAllProducts);
router.get("/product/cart", isAuthenticatedUser, getCartUser);
router.get("/product/:id", getProductDetail);

// put 
router.put("/review", isAuthenticatedUser, createProductReview);
router.put("/me/cart", isAuthenticatedUser, addToCartUser);
router.put("/admin/product/update/:id", isAuthenticatedUser, authRoles("admin"), updateProduct);

// delete
router.delete("/admin/reviews", isAuthenticatedUser, authRoles("admin"), deleteReview);
router.delete("/admin/product/delete/:id", isAuthenticatedUser, authRoles("admin"), deleteProduct);

module.exports = router;