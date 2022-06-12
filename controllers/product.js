const Change = require('../models/change');
const Product = require('../models/product');

exports.list = async (req, res, next) => {
  try {
    const products = await Product.findByPage(req.query.page);
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
};

exports.view = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      throw new Error('No product found for given id');
    }
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

exports.add = async (req, res, next) => {
  try {
    const product = await Product.create({
      name: req.body.name,
      price: req.body.price,
      userId: req.user._id,
    });
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const response = await Product.updatePrice(
      req.params.id,
      req.body.price,
      req.user._id
    );
    res.status(200).json({
      success: true,
      ...response,
    });
  } catch (error) {
    next(error);
  }
};
