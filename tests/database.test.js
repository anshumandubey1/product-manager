const mongoose = require('mongoose');
require('dotenv').config({ path: '.test.env' });
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
