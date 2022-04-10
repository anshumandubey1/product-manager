require('./database.test');
const mongoose = require('mongoose');
const { signUp } = require('../controllers/user');
const User = require('../models/user');
describe('User Authorization', () => {

  it('should add user to database when unique email id and a password is given', async () => {
    const mReq = {
      body: {
        email: "abc@gmail.com",
        password: "12345678"
      }
    };

    const mRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn((data) => {
        expect(data).toBeTruthy();
        expect(data.success).toBeTruthy();
        expect(data.user).toBeTruthy();
        expect(mongoose.Types.ObjectId.isValid(data.user._id)).toBeTruthy();
        expect(data.user.password == mReq.body.password).toBeFalsy();
      })
    };

    const mNext = jest.fn((x) => {
      expect(x).toBeFalsy();
    })

    await signUp(mReq, mRes, mNext);

    await User.findOneAndDelete({email: mReq.body.email});
    
  });

  it.todo('should return valid jwt token when recieved valid email and password');
  
  it.todo('should return valid jwt token with admin privilages when account associated with email has admin privilage');
  
});
