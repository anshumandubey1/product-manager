require('dotenv').config();
const mongoose = require('mongoose');
beforeAll(() => require('../models/index').connect());

afterAll(() => {
    mongoose.connection.close();
});

describe('Database Connection', () => {
  
  
  it('should connect to mongodb when loaded', () => {
    expect(mongoose.connection.readyState).toBe(1);
  });
  
})
