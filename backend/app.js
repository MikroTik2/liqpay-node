const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const errorMiddleware = require("./middlewares/error.js");

const app = express();

// Routes
const userRoute = require("./routes/userRoute.js");
const productRoute = require("./routes/productRoute.js");
const orderRoute = require("./routes/orderRoute.js");
const paymentRoute = require("./routes/paymentRoute.js");

if (process.env.NODE_ENV !== 'production') {
     require('dotenv').config({ path: "backend/config/config.env" });
};

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(morgan("dev"));

app.use("/api/v1", userRoute);
app.use("/api/v1", productRoute);
app.use("/api/v1", orderRoute);
app.use("/api/v1", paymentRoute);

app.use(errorMiddleware);

module.exports = app;