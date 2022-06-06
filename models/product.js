const mongoose = require('mongoose');
const Change = require('./change');

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

ProductSchema.post('findOneAndDelete', async function (result) {
  await Change.deleteByProductId(result._id);
});

ProductSchema.statics.findByPage = (page) => {
  const limit = 10;
  const skip = limit * (page - 1);
  return Product.find().skip(skip).limit(limit);
};

ProductSchema.statics.updatePrice = async (_id, newPrice, userId) => {
  const product = await Product.findById(_id);
  const change = await Change.create({
    from: product.price,
    to: newPrice,
    userId: userId,
    productId: product._id,
  });
  product.price = newPrice;
  await product.save();
  return { product, change };
};

const Product = mongoose.model('products', ProductSchema);
module.exports = Product;
