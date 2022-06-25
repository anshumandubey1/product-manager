require('../../database.test');
describe('User Authorization', () => {
  const { verify } = require('../../../services/jwt');
  const { login } = require('../../../controllers/user');
  const User = require('../../../models/user');
  const email = `abc${Date.now()}@gmail.com`;
  const password = '12345678';

  beforeAll(async () => {
    const { signUp } = require('../../../controllers/user');
    const mongoose = require('mongoose');
    const mReq = {
      body: {
        email,
        password,
      },
    };

    const mRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn((data) => {
        expect(data).toBeTruthy();
        expect(data.success).toBeTruthy();
        expect(data.user).toBeTruthy();
        expect(mongoose.Types.ObjectId.isValid(data.user._id)).toBeTruthy();
        expect(data.user.password == password).toBeFalsy();
      }),
    };

    const mNext = jest.fn((x) => {
      expect(x).toBeFalsy();
    });

    await signUp(mReq, mRes, mNext);
  }, 1000);

  it('should add user to database when unique email id and a password is given', async () => {});

  it('should return valid jwt token when recieved valid email and password', async () => {
    const mReq = {
      body: {
        email,
        password,
      },
    };

    const mRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn((data) => {
        expect(data).toBeTruthy();
        expect(verify(data.token)).resolves.toHaveProperty('email', email);
      }),
    };

    const mNext = jest.fn((x) => {
      expect(x).toBeFalsy();
    });

    await login(mReq, mRes, mNext);
  });

  it('should return valid jwt token with admin privilages when account associated with email has admin privilage', async () => {
    await User.findOneAndUpdate({ email }, { access: 'admin' });

    const mReq = {
      body: {
        email,
        password,
      },
    };

    const mRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn((data) => {
        expect(data).toBeTruthy();
        expect(verify(data.token)).resolves.toHaveProperty('access', 'admin');
      }),
    };

    const mNext = jest.fn((x) => {
      expect(x).toBeFalsy();
    });

    await login(mReq, mRes, mNext);
  });

  afterAll(async () => {
    await User.findOneAndDelete({ email });
  }, 1000);
});
