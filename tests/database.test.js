require('dotenv').config();
describe('Database Connection', () => {
  const mongoose = require('mongoose');
  beforeAll(() => require('../models/index').connect());
  
  afterAll(() => {
      mongoose.connection.close();
  });
  
  it('should connect to mongodb when loaded', () => {
    expect(mongoose.connection.readyState).toBe(1);
  });
  
})
