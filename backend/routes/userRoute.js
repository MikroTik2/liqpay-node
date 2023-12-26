const express = require("express");
const router = express.Router();
const { createUser, loginUser, forgotPassword, logoutUser, getUserDetails, getAllUsers, getSingleUser, resetPassword, updateUserRole, updatePassword, updateProfile, deleteUser } = require("../controllers/userCtrl.js");
const { isAuthenticatedUser, authRoles } = require("../middlewares/auth.js");

// post
router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/password/forgot", forgotPassword);

// get
router.get("/admin/users", getAllUsers);
router.get("/logout", logoutUser);
router.get("/me", isAuthenticatedUser, getUserDetails);
router.get("/admin/single/:id", isAuthenticatedUser, authRoles("admin"), getSingleUser);

// put
router.put("/me/update", isAuthenticatedUser, updateProfile);
router.put("/password/update", isAuthenticatedUser, updatePassword);
router.put("/password/reset/:token", resetPassword);
router.put("/admin/update/:id", isAuthenticatedUser, authRoles("admin"), updateUserRole);

// delete
router.delete("/delete/:id", isAuthenticatedUser, authRoles("admin"), deleteUser);

module.exports = router;