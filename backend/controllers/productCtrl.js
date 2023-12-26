const Product = require('../models/productModel.js');
const User = require("../models/userModel.js");
const SearchFeatures = require('../utils/searchFeature.js');
const ErrorHandler = require('../utils/errorHandler.js');
const asyncHandler = require('../middlewares/asyncHandler.js');
const cloudinary = require('cloudinary');

// create product
const createProduct = asyncHandler(async (req, res) => {

     let images = [];

     if (typeof req.body.images === "string") {

          images.push(req.body.images);

     } else {
          images = req.body.images;
     };

     const imagesLink = [];

     for (let i = 0; i < images.length; i++) {

          const result = await cloudinary.v2.uploader.upload(images[i], {
               folder: "products",
          });
          
          imagesLink.push({
               public_id: result.public_id,
               url: result.secure_url,
          });
     };

     const result = await cloudinary.v2.uploader.upload(req.body.logo, {
          folder: "brands",
     });

     const brandLogo = {
          public_id: result.public_id,
          url: result.secure_url,
     };

     req.body.brand = {
          name: req.body.brandname,
          logo: brandLogo,
     };

     req.body.images = imagesLink;
     req.body.user = req.user.id;

     let specs = [];

     req.body.specifications.forEach((s, index) => {
          if (typeof s === "string") {
               specs.push(JSON.parse)
          } else {
               specs.push(s);
          };
     });

     req.body.specifications = specs;

     const product = await Product.create(req.body);


     res.status(201).json({
          success: true,
          product,
     });
});

// create or update reviews
const createProductReview = asyncHandler(async (req, res, next) => {
     
     const { rating, comment, productId } = req.body;

     const review = {
          user: req.user.id,
          name: req.user.name,
          rating: Number(rating),
          comment,
     };

     const product = await Product.findById(productId);
     if (!product) return next(new ErrorHandler("Product not found"));

     const isReviewed = product.reviews.find(review => review.user.toString() === req.user._id.toString());

     if (isReviewed) {

          product.reviews.forEach((rev) => {
               if (rev.user.toString() === req.user._id.toString()) {
                    (rev.rating = rating, rev.comment = comment);
               };
          });

     } else {

          product.reviews.push(review);
          product.numOfReviews = product.reviews.length;

     };

     let avg = 0;

     product.reviews.forEach((rev) => {
          avg += rev.rating;
     });

     product.ratings = avg / product.reviews.length;

     await product.save({ validateBeforeSave: false });

     res.status(200).json({
          success: true,
     });
});

// get admin products
const getAdminProducts = asyncHandler(async (req, res, next) => {

     const products = await Product.find();
     
     res.status(200).json({
          success: true,
          products,
     });
})  ;

// get products
const getProducts = asyncHandler(async (req, res, next) => {
     const products = await Product.find();

     res.status(200).json({
          success: true,
          products,
     });
});

// get all products
const getAllProducts = asyncHandler(async (req, res, next) => {

     const page = 12;
     const productsCount = await Product.countDocuments();

     const searchFeature = new SearchFeatures(Product.find(), req.query);

     let products = await searchFeature.query;
     let filteredProductsCount = products.length;

     searchFeature.pagination.query;
     
     products = await searchFeature.query.clone();

     res.status(200).json({
          success: true,
          products,
          productsCount,
          page,
          filteredProductsCount,
     });
});

// get product detail
const getProductDetail = asyncHandler(async (req, res, next) => {

     const product = await Product.findById(req.params.id);
     if (!product) return next(new ErrorHandler("Product not found", 404));

     res.status(200).json({
          success: true,
          product,
     });
});

// get all reviews of product
const getAllReviews = asyncHandler(async (req, res, next) => {
     const product = await Product.findById(req.query.id);
     if (!product) return next(new ErrorHandler("Product not found", 404));

     res.status(200).json({
          success: true,
          reviews: product.reviews,
     });
});

// update product
const updateProduct = asyncHandler(async (req, res, next) => {
     let product = await Product.findById(req.params.id);
 
     if (!product) {
         return next(new ErrorHandler("Product Not Found", 404));
     }
 
     if (req.body.images !== undefined) {
         let images = [];
 
         if (typeof req.body.images === "string") {
             images.push(req.body.images);
         } else {
             images = req.body.images;
         }
         for (let i = 0; i < product.images.length; i++) {
             await cloudinary.v2.uploader.destroy(product.images[i].public_id);
         }
 
         const imagesLink = [];
 
         for (let i = 0; i < images.length; i++) {
             const result = await cloudinary.v2.uploader.upload(images[i], {
                 folder: "products",
             });
 
             imagesLink.push({
                 public_id: result.public_id,
                 url: result.secure_url,
             });
         }
 
         req.body.images = imagesLink;
     }
 
     if (req.body.logo && req.body.logo.length > 0) {
         await cloudinary.v2.uploader.destroy(product.brand.logo.public_id);
         const result = await cloudinary.v2.uploader.upload(req.body.logo, {
             folder: "brands",
         });
         const brandLogo = {
             public_id: result.public_id,
             url: result.secure_url,
         };
 
         req.body.brand = {
             name: req.body.brandname,
             logo: brandLogo,
         };
     }
 
     let specs = [];
 
     if (req.body.specifications) {
         req.body.specifications.forEach((s) => {
             specs.push(JSON.parse(s));
         });
     }
 
     req.body.specifications = specs;
     req.body.user = req.user.id;
 
     product = await Product.findByIdAndUpdate(req.params.id, req.body, {
         new: true,
         runValidators: true,
         useFindAndModify: false,
     });
 
     res.status(201).json({
         success: true,
         product,
     });
});
 
// add to cart product
const addToCartUser = asyncHandler(async (req, res, next) => {
     const { cart } = req.body;
     const id = req.user.id;

     try {

          const user = await User.findById(id);
          if (!user) return next(new ErrorHandler("User not found"));

          for (let i = 0; i < cart.length; i++) {

               const product = await Product.findById(cart[i].product).select('price images name').exec();
               if (!product) return next(new ErrorHandler(`Product not found ${cart[i].product}`));

               console.log(product.name)

               if (product) {

                    const existingCartItemIndex = user.cart.findIndex(item => item.product.toString() === product._id.toString());

                    if (existingCartItemIndex !== -1) {

                         user.cart[existingCartItemIndex].quantity += cart[i].quantity;
                         user.cart[existingCartItemIndex].priceTotal = product.price * user.cart[existingCartItemIndex].quantity;

                    } else {

                         const cartItem = {
                              product: product._id,
                              name: product.name,
                              imagesUrl: product.images.map(image => image.url),
                              quantity: cart[i].quantity,
                              priceTotal: product.price * cart[i].quantity,
                              price: product.price,
                         };

                         await user.cart.push(cartItem);

                    };

               };

          };

          user.totalPrice = calculateCartTotal(user.cart);
          await user.save();

          res.json({ cart: user.cart, totalPrice: user.totalPrice });
     } catch (error) {
          return next(new ErrorHandler(`Product not found ${cart[i].product}`));
     };
});

// get to cart user
const getCartUser = asyncHandler(async (req, res, next) => {
     const id = req.user.id;

     const user = await User.findById(id);
     if (!user) return next(new ErrorHandler("User not found"));
     
     res.json(user.cart);
})

// delete product
const deleteProduct = asyncHandler(async (req, res, next) => {
     const product = await Product.findById(req.params.id);
     if (!product) return next(new ErrorHandler("Product not found"), 404);

     const deleteImagePromises = product.images.map(async (image) => {
          await cloudinary.v2.uploader.destroy(image.public_id);
     });

     await Promise.all(deleteImagePromises);
     await Product.findByIdAndDelete(req.params.id);
     
     res.status(201).json({
          success: true,
          product,
     });
});

// delete review
const deleteReview = asyncHandler(async (req, res, next) => {

     const productId = req.query.productId;
     const reviewsId = req.query.id;

     const product = await Product.findById(productId);

     if (!product) {
         return next(new ErrorHandler("Product Not Found", 404));
     };
 
     const reviews = product.reviews.filter((rev) => rev._id && rev._id.toString() !== reviewsId);

     await Product.findByIdAndUpdate(productId, { reviews: reviews });
 
     res.status(200).json({
         success: true,
         message: "reviews be successfully deleted.",
         reviews,
     });
});

const calculateCartTotal = (cart) => {
     if (!cart || !cart.length) {
          return 0;
     };

     let cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

     return cartTotal;
};

module.exports = { createProduct, createProductReview, addToCartUser, getCartUser, getAllProducts, getProductDetail, getAdminProducts, getProducts, getAllReviews, updateProduct, deleteProduct, deleteReview };

