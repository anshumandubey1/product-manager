require('./database.test');
const User = require("../models/user");
const ProductController = require('../controllers/product');
const mongoose = require('mongoose');
const Product = require('../models/product');

describe('Products', () => {
  const name = 'Water Bottle';
  let _id = '';
  const price = 300;
  let user = {};

  beforeAll(async () => {
    user = new User({
      email: "abcde@gmail.com",
      password: "123",
      access: 'admin'
    });
    await user.save();
  })
  
  it('should return product details after adding to db when product details and user data is provided.', async () => {
    
    const mReq = {
      body: {
        name,
        price
      },
      user: {
        _id: user._id,
        email: user.email,
        access: user.access
      }
    };

    const mRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn((data) => {
        expect(data).toBeTruthy();
        expect(data.success).toBeTruthy();
        expect(data.product).toBeTruthy();
        expect(mongoose.Types.ObjectId.isValid(data.product._id)).toBeTruthy();
        expect(mongoose.Types.ObjectId.isValid(data.product.userId)).toBeTruthy();
        expect(data.product.name).toBe(name);
        expect(data.product.price).toBe(price);
        expect(data.product.userId).toBe(user._id);
        _id = data.product._id;
      })
    };

    const mNext = jest.fn((x) => {
      expect(x).toBeFalsy();
    })

    await ProductController.add(mReq, mRes, mNext);
  });
  
  it.todo('should update price of product to new price when valid price, product id and admin token is provided');
  
  it.todo('should return list of atmost 10 products when valid page number is provided');

  it.todo('should return all details of a product when valid product id is provided');


  afterAll(async () => {
    await Product.findByIdAndDelete(_id);
    await User.findOneAndDelete({email: user.email});
  }, 1000)

});
