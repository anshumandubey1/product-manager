const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
    {
        name: {
          type: String,
          required: true
        },
        price: {
          type: Number,
          required: true
        },
        userId: {
          type: mongoose.Types.ObjectId,
          ref: 'users',
          required: true
        }
    },
    { timestamps: true },
    { collection: 'products' }
);


const Product = mongoose.model('products', ProductSchema);
module.exports = Product;
