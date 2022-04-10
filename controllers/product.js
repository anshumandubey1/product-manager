const Product = require("../models/product");

exports.add = async (req, res, next) => {
  try {
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      userId: req.user._id
    });
    await product.save();
    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
}