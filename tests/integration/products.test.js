require('../database.test');

const request = require('supertest');
const app = require('../../app');
const { sign } = require('../../helpers/jwt');
const Product = require('../../models/product');
const User = require('../../models/user');

describe('Products and Changes', () => {
  let product, admin, user, change, adminToken, userToken;

  beforeAll(async () => {
    admin = await User.create({
      email: `admin${Date.now()}@gmail.com`,
      password: '123',
      access: 'admin',
    });
    user = await User.create({
      email: `user${Date.now()}@gmail.com`,
      password: '123',
      access: 'user',
    });

    adminToken = sign({
      _id: admin._id,
      email: admin.email,
      access: admin.access,
    });

    userToken = sign({
      _id: user._id,
      email: user.email,
      access: user.access,
    });

    product = await Product.create({
      name: 'Orange',
      price: 25,
      userId: admin._id,
    });

    const response = await Product.updatePrice(product._id, 10, admin._id);
    product = response.product;
    change = response.change;
  }, 5000);

  it('should return a list of products, atmost 10 at a time', async () => {
    const response = await request(app)
      .get('/products')
      .set('Accept', 'application/json');
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.status).toEqual(200);
    expect(response.body.success).toBeTruthy();
    expect(response.body.products[0]).toBeTruthy();
    expect(response.body.products.length).toBeLessThanOrEqual(10);
  });

  it('should return details of a product when valid id is given', async () => {
    const response = await request(app)
      .get(`/products/${product._id}`)
      .set('Accept', 'application/json');
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.status).toEqual(200);
    expect(response.body.success).toBeTruthy();
    expect(response.body.product).toBeTruthy();
    expect(response.body.product.name).toBe(product.name);
  });
  it('should not show details of a product return error when invalid id is given', async () => {
    const response = await request(app)
      .get(`/products/${product.userId}`)
      .set('Accept', 'application/json');
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.status).not.toEqual(200);
    expect(response.body.success).toBeFalsy();
  });

  it('should add a product when valid details and token with admin privilage is given', async () => {
    const response = await request(app)
      .post(`/products/add`)
      .send({
        name: 'Watermellon',
        price: 50,
      })
      .set('Authorization', adminToken)
      .set('Accept', 'application/json');
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.status).toEqual(200);
    expect(response.body.success).toBeTruthy();
    expect(response.body.product.name).toBe('Watermellon');
    expect(response.body.product.price).toBe(50);
  });
  it('should not add a product and return error when valid details and token with user privilage is given', async () => {
    const response = await request(app)
      .post(`/products/add`)
      .send({
        name: 'MellonWater',
        price: 50,
      })
      .set('Authorization', userToken)
      .set('Accept', 'application/json');
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.status).not.toEqual(200);
    expect(response.body.success).toBeFalsy();
  });

  it('should update a product when valid details and token with admin privilage is given', async () => {
    const myProduct = await Product.create({
      name: 'Guava',
      price: 16,
      userId: admin._id,
    });
    const response = await request(app)
      .put(`/products/${myProduct._id}`)
      .send({
        price: 80,
      })
      .set('Authorization', adminToken)
      .set('Accept', 'application/json');
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.status).toEqual(200);
    expect(response.body.success).toBeTruthy();
  });
  it('should not update a product and return error when valid details and token with user privilage is given', async () => {
    const response = await request(app)
      .put(`/products/${product._id}`)
      .send({
        price: 100,
      })
      .set('Authorization', userToken)
      .set('Accept', 'application/json');
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.status).not.toEqual(200);
    expect(response.body.success).toBeFalsy();
  });

  it('should return list of all changes in a product when valid product id and admin token is given', async () => {
    const response = await request(app)
      .get(`/products/${product._id}/changes`)
      .set('Authorization', adminToken)
      .set('Accept', 'application/json');
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.status).toEqual(200);
    expect(response.body.success).toBeTruthy();
    expect(response.body.changes[0]).toBeTruthy();
    expect(response.body.changes.length).toBeLessThanOrEqual(10);
  });
  it('should not show list of all changes in a product and throw error when valid product id is given and token with user privilage is given', async () => {
    const response = await request(app)
      .get(`/products/${product.userId}/changes`)
      .set('Authorization', userToken)
      .set('Accept', 'application/json');
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.status).not.toEqual(200);
    expect(response.body.success).toBeFalsy();
  });

  it('should return details of a change when valid product and change id is given', async () => {
    const response = await request(app)
      .get(`/products/${product._id}/changes/${change._id}`)
      .set('Authorization', adminToken)
      .set('Accept', 'application/json');
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.status).toEqual(200);
    expect(response.body.success).toBeTruthy();
    expect(response.body.change).toBeTruthy();
    expect(response.body.change.from).toBe(change.from);
    expect(response.body.change.to).toBe(change.to);
  });
  it('should not show details of a product return error when valid product and invalid change id is given', async () => {
    const response = await request(app)
      .get(`/products/${product._id}/changes/${product._id}`)
      .set('Authorization', adminToken)
      .set('Accept', 'application/json');
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.status).not.toEqual(200);
    expect(response.body.success).toBeFalsy();
  });

  afterAll(async () => {
    await User.findByIdAndDelete(admin._id);
    await User.findByIdAndDelete(user._id);
    await Product.findByIdAndDelete(product._id);
  }, 5000);
});
