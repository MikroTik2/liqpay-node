const jwt = require("jsonwebtoken");
const asyncHandler = require("../middlewares/asyncHandler.js");
const User = require("../models/userModel.js");
const ErrorHandler = require("../utils/errorHandler.js");

const isAuthenticatedUser = asyncHandler(async (req, res, next) => {
     
     const { token } = req.cookies;
     if (!token)  return next(new ErrorHandler("Please login to access", 401));

     const decoded = jwt.verify(token, process.env.JWT_SECRET);
     req.user = await User.findById(decoded.id);
     next();

});

const authRoles = ( ...roles ) => {
     return (req, res, next) => {

          if (!roles.includes(req.user.role)) {
               return next(new ErrorHandler(`Role ${req.user.role} is not allowed`, 403));
          };

          next();

     };
};

module.exports = { isAuthenticatedUser, authRoles };