require('../../database.test');
const User = require('../../../models/user');
const ProductController = require('../../../controllers/product');
const mongoose = require('mongoose');
const Product = require('../../../models/product');

describe('Products', () => {
  const name = 'Water Bottle';
  let _id = '';
  const price = 300;
  let user = {};

  beforeAll(async () => {
    user = new User({
      email: `abc${Date.now()}@gmail.com`,
      password: '123',
      access: 'admin',
    });
    await user.save();
  }, 1000);

  it('should return product details after adding to db when product details and user data is provided.', async () => {
    const mReq = {
      body: {
        name,
        price,
      },
      user: {
        _id: user._id,
        email: user.email,
        access: user.access,
      },
    };

    const mRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn((data) => {
        expect(data).toBeTruthy();
        expect(data.success).toBeTruthy();
        expect(data.product).toBeTruthy();
        expect(mongoose.Types.ObjectId.isValid(data.product._id)).toBeTruthy();
        expect(
          mongoose.Types.ObjectId.isValid(data.product.userId)
        ).toBeTruthy();
        expect(data.product.name).toBe(name);
        expect(data.product.price).toBe(price);
        expect(data.product.userId).toBe(user._id);
        _id = data.product._id;
      }),
    };

    const mNext = jest.fn((x) => {
      expect(x).toBeFalsy();
    });

    await ProductController.add(mReq, mRes, mNext);
  });

  it('should return error when invalid product price is provided while adding.', async () => {
    const mReq = {
      body: {
        name,
        price: '100',
      },
      user: {
        _id: user._id,
        email: user.email,
        access: user.access,
      },
    };

    const mRes = {};

    const mNext = jest.fn((x) => {
      expect(x).toBeInstanceOf(Error);
    });

    await ProductController.add(mReq, mRes, mNext);
  });

  it('should update price of product, and return change details to new price when valid price, product id and admin token is provided', async () => {
    const mReq = {
      body: {
        price: price + 5,
      },
      user: {
        _id: user._id,
        email: user.email,
        access: user.access,
      },
      params: {
        id: _id,
      },
    };

    const mRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn((data) => {
        expect(data).toBeTruthy();
        expect(data.success).toBeTruthy();
        expect(data.product).toBeTruthy();
        expect(mongoose.Types.ObjectId.isValid(data.product._id)).toBeTruthy();
        expect(
          mongoose.Types.ObjectId.isValid(data.product.userId)
        ).toBeTruthy();
        expect(data.product.name).toBe(name);
        expect(data.product.price).toBe(price + 5);
        expect(data.product.userId.equals(user._id)).toBeTruthy();

        expect(data.change).toBeTruthy();
        expect(mongoose.Types.ObjectId.isValid(data.change._id)).toBeTruthy();
        expect(
          mongoose.Types.ObjectId.isValid(data.change.userId)
        ).toBeTruthy();
        expect(
          mongoose.Types.ObjectId.isValid(data.change.productId)
        ).toBeTruthy();
        expect(data.change.from).toBe(price);
        expect(data.change.to).toBe(price + 5);
        expect(data.change.userId.equals(user._id)).toBeTruthy();
        expect(data.change.productId.equals(_id)).toBeTruthy();
      }),
    };

    const mNext = jest.fn((x) => {
      expect(x).toBeFalsy();
    });

    await ProductController.update(mReq, mRes, mNext);
  });

  it('should return error when invalid product price is provided while updating.', async () => {
    const mReq = {
      body: {
        price: '100',
      },
      user: {
        _id: user._id,
        email: user.email,
        access: user.access,
      },
    };

    const mRes = {};

    const mNext = jest.fn((x) => {
      expect(x).toBeInstanceOf(Error);
    });

    await ProductController.update(mReq, mRes, mNext);
  });

  it('should return list of atmost 10 products when valid page number is provided', async () => {
    const mReq = {
      query: {
        page: 1,
      },
    };

    const mRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn((data) => {
        expect(data).toBeTruthy();
        expect(data.success).toBeTruthy();
        expect(data.products).toBeTruthy();
        expect(data.products.length).toBeLessThanOrEqual(10);
      }),
    };

    const mNext = jest.fn((x) => {
      expect(x).toBeFalsy();
    });

    await ProductController.list(mReq, mRes, mNext);
  });

  it('should return error when invalid page number is provided', async () => {
    const mReq = {
      query: {
        page: -1,
      },
    };

    const mRes = {};

    const mNext = jest.fn((x) => {
      expect(x).toBeInstanceOf(Error);
    });

    await ProductController.list(mReq, mRes, mNext);
  });

  it('should return all details of a product when valid product id is provided', async () => {
    const mReq = {
      body: {
        price: price + 5,
      },
      params: {
        id: _id,
      },
    };

    const mRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn((data) => {
        expect(data).toBeTruthy();
        expect(data.success).toBeTruthy();
        expect(data.product).toBeTruthy();
        expect(mongoose.Types.ObjectId.isValid(data.product._id)).toBeTruthy();
        expect(
          mongoose.Types.ObjectId.isValid(data.product.userId)
        ).toBeTruthy();
        expect(data.product.name).toBe(name);
        expect(data.product.price).toBe(price + 5);
        expect(data.product.userId.equals(user._id)).toBeTruthy();
      }),
    };

    const mNext = jest.fn((x) => {
      expect(x).toBeFalsy();
    });

    await ProductController.view(mReq, mRes, mNext);
  });

  afterAll(async () => {
    await Product.findByIdAndDelete(_id);
    await User.findOneAndDelete({ email: user.email });
  }, 1000);
});
