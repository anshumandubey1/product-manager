require('./database.test');
const Change = require("../models/change");
const ChangeController = require('../controllers/change');
const Product = require("../models/product");
const User = require("../models/user");

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

  it.todo('should return json with details of a change when valid change id and admin token is provided');

  afterAll(async () => {
    await Change.findByIdAndDelete(change._id)
    await Product.findByIdAndDelete(product._id);
    await User.findByIdAndDelete(user._id);
  }, 1000)
  
});
