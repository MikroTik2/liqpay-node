const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Declare the Schema of the Mongo model
let userSchema = new mongoose.Schema({
     name: {
          type: String,
          required: [true, "Please enter your name"],
     },
     email: {
          type: String,
          required: [true, "Please enter your email"],
          unique: true,
     },
     gender: {
          type: String,
          required: [true, "Please enter your gender"],
     },
     password: {
          type: String,
          required: [true, "Please enter your password"],
          minLength: [8, "Password should have atleast 8 chars"],
          select: false,
     },
     avatar: {
          public_id: String,
          url: String,
     },
     role: {
          type: String,
          enum: ["user", "admin", "superadmin"],
          default: "user",
     },
     createdAt: {
          type: Date,
          default: Date.now(),
     },
     cart: [{
          product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
          quantity: { type: Number, default: 1 },
          imagesUrl: [String],
          name: { type: String },
          price: { type: Number },
          priceTotal: { type: Number },
     }],
     totalPrice: {
          type: Number,
          default: 0,
     },

     resetPasswordToken: String,
     resetPasswordExpire: Date,

});

userSchema.pre("save", async function (next) {

     if (!this.isModified("password")) {
          next();
     };

     this.password = await bcrypt.hash(this.password, 10);

});

userSchema.methods.getJWTToken = function () {
     return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

userSchema.methods.comparePassword = async function (enteredPassword) {
     return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getResetPasswordToken = async function () {

     const resetToken = crypto.randomBytes(20).toString("hex");

     this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
     this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

     return resetToken;

};

//Export the model
module.exports = mongoose.model('User', userSchema);