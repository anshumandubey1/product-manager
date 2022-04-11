require('./database.test');
const Change = require("../models/change");
const ChangeController = require('../controllers/change');
const Product = require("../models/product");
const User = require("../models/user");
const mongoose = require('mongoose');

describe('Change History', () => {
  let user = {};
  let product = {};
  let change = {};
  const newPrice = 350;

  beforeAll(async () => {
    user = new User({
      email: "abcdef@gmail.com",
      password: "123",
      access: 'admin'
    });
    await user.save();
    product = new Product({
      name: "Water Bottle",
      price: 300,
      userId: user._id
    });
    await product.save();
    change = new Change({
      from: product.price,
      to: newPrice,
      userId: user._id,
      productId: product._id
    });
    change.save();
  }, 1000);

  it('should return json with atmost 10 changes made to a product when valid product id, page number and user details is provided', async () => {
    const mReq = {
      query: {
        page: 1
      },
      params: {
        id: product._id
      }
    };

    const mRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn((data) => {
        expect(data).toBeTruthy();
        expect(data.success).toBeTruthy();
        expect(data.changes).toBeTruthy();
        expect(data.changes.length).toBeLessThanOrEqual(10);
      })
    };

    const mNext = jest.fn((x) => {
      expect(x).toBeFalsy();
    })

    await ChangeController.list(mReq, mRes, mNext);
  });

  it('should return json with details of a change when valid change id and admin token is provided', async () => {
    const mReq = {
      params: {
        id: product._id,
        cid: change._id
      }
    };

    const mRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn((data) => {
        expect(data).toBeTruthy();
        expect(data.success).toBeTruthy();
        expect(data.change).toBeTruthy();
        expect(mongoose.Types.ObjectId.isValid(data.change._id)).toBeTruthy();
        expect(mongoose.Types.ObjectId.isValid(data.change.userId)).toBeTruthy();
        expect(mongoose.Types.ObjectId.isValid(data.change.productId)).toBeTruthy();
        expect(data.change.from).toBe(change.from);
        expect(data.change.to).toBe(change.to);
        expect(data.change.userId.equals(user._id)).toBeTruthy();
        expect(data.change.productId.equals(product._id)).toBeTruthy();
      })
    };

    const mNext = jest.fn((x) => {
      expect(x).toBeFalsy();
    })

    await ChangeController.view(mReq, mRes, mNext);
  });

  afterAll(async () => {
    await Change.findByIdAndDelete(change._id)
    await Product.findByIdAndDelete(product._id);
    await User.findByIdAndDelete(user._id);
  }, 1000)
  
});
