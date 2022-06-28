const { default: mongoose } = require('mongoose');
const Change = require('../../../models/change');
const Product = require('../../../models/product');

require('../../database.test');
describe('Change Model Test', () => {
  const product = {
    name: 'Apple',
    price: 20,
    userId: '629c9375ea07442790b3d696',
  };
  const change = {
    from: product.price,
    to: 15,
    userId: product.userId,
  };
  beforeAll(async () => {
    const newProduct = await Product.create(product);
    product._id = newProduct._id;
    change.productId = newProduct._id;
  }, 1000);

  it('should add a change to the database when valid details are given', async () => {
    console.log({ product, change });
    const newChange = await Change.create(change);
    product.price = 15;
    expect(mongoose.Types.ObjectId.isValid(newChange._id)).toBeTruthy();
    change._id = newChange._id;
  });

  it('should provide the details of a change when valid id of the change is provided', async () => {
    const getChange = await Change.findById(change._id);
    expect(getChange.from).toBe(change.from);
    expect(getChange.to).toBe(change.to);
    expect(getChange.userId.equals(change.userId)).toBeTruthy();
    expect(getChange.productId.equals(change.productId)).toBeTruthy();
  });

  it('should find all changes to a given product, 10 at a time based on page', async () => {
    const getChanges = await Change.findByProductId(product._id, 1);
    expect(getChanges[0]).toBeTruthy();
    expect(getChanges.length).toBeLessThanOrEqual(10);
  });

  it('should remove all changes from the database when valid product id is provided', async () => {
    const response = await Change.deleteByProductId(product._id);
    expect(response.acknowledged).toBeTruthy();
    expect(response.deletedCount).toBeGreaterThan(0);
  });
});
