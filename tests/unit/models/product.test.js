const { default: mongoose } = require('mongoose');
const Product = require('../../../models/product');

require('../../database.test');
describe('Product Model Test', () => {
  const product = {
    name: 'Apple',
    price: 20,
    userId: '629c9375ea07442790b3d696',
  };

  it('should add product to database when valid details are given', async () => {
    const newProduct = await Product.create(product);
    expect(mongoose.Types.ObjectId.isValid(newProduct._id)).toBeTruthy();
    product._id = newProduct._id;
  });

  it('should get product from database when valid id is given', async () => {
    const getProduct = await Product.findById(product._id);
    expect(getProduct.name).toBe(product.name);
    expect(getProduct.price).toBe(product.price);
    expect(getProduct.userId.equals(product.userId)).toBeTruthy();
  });

  it('should give a list of products based on page, 10 at a time', async () => {
    const getProducts = await Product.findByPage(1);
    expect(getProducts[0]).toBeTruthy();
    expect(getProducts.length).toBeLessThanOrEqual(10);
  });

  it('should update product from database and add change document to database when valid productId, price and userId is given', async () => {
    const response = await Product.updatePrice(product._id, 15, product.userId);
    expect(response).toBeTruthy();
    expect(response.product).toBeTruthy();
    expect(mongoose.Types.ObjectId.isValid(response.product._id)).toBeTruthy();
    expect(
      mongoose.Types.ObjectId.isValid(response.product.userId)
    ).toBeTruthy();
    expect(response.product.name).toBe(product.name);
    expect(response.product.price).toBe(15);
    expect(response.product.userId.equals(product.userId)).toBeTruthy();

    expect(response.change).toBeTruthy();
    expect(mongoose.Types.ObjectId.isValid(response.change._id)).toBeTruthy();
    expect(
      mongoose.Types.ObjectId.isValid(response.change.userId)
    ).toBeTruthy();
    expect(
      mongoose.Types.ObjectId.isValid(response.change.productId)
    ).toBeTruthy();
    expect(response.change.from).toBe(product.price);
    expect(response.change.to).toBe(15);
    expect(response.change.userId.equals(product.userId)).toBeTruthy();
    expect(response.change.productId.equals(product._id)).toBeTruthy();
  });

  it('should delete product from database when valid id is given', async () => {
    const deletedProduct = await Product.findByIdAndDelete(product._id);
    expect(deletedProduct.name).toBe(product.name);
    expect(deletedProduct.userId.equals(product.userId)).toBeTruthy();
  });
});
