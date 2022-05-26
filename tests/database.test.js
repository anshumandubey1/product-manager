require('dotenv').config({ path: '.test.env' });
const mongoose = require('mongoose');
beforeAll(() => require('../models/index').connect());

afterAll(async () => {
  // await mongoose.connection.collections['users'].drop();
  mongoose.connection.close();
});

describe('Database Connection', () => {
  it('should connect to mongodb when loaded', () => {
    expect(mongoose.connection.readyState).toBe(1);
  });
});
