const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'users',
      required: true,
    },
  },
  { timestamps: true },
  { collection: 'products' }
);

ProductSchema.statics.findByPage = (page) => {
  const limit = 10;
  const skip = limit * (page - 1);
  return Product.find().skip(skip).limit(limit);
};

const Product = mongoose.model('products', ProductSchema);
module.exports = Product;
