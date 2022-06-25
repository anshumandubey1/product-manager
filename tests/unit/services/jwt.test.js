const { JsonWebTokenError } = require('jsonwebtoken');
const { sign, verify, isLoggedIn, isAdmin } = require('../../../services/jwt');
require('../../database.test');
describe('JWT Helper tests', () => {
  const userData = {
    data1: 'Hey There',
    data2: true,
    data3: 42,
    data4: ['no', 1, false],
  };
  it('should verify a signed token when same TOKEN SECRET is used', async () => {
    const token = sign(userData);
    const returnedData = await verify(token);
    expect(returnedData).toMatchObject(userData);
  });

  it('should throw error on a signed token when token is changed', (done) => {
    const token = sign(userData);
    verify(token + 'abc')
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });

  it('should put user data in req.user if valid token is provided', async () => {
    const next = jest.fn();
    const token = sign(userData);
    const req = {
      headers: {
        authorization: token,
      },
    };
    await isLoggedIn(req, {}, next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toMatchObject(userData);
  });

  it('should throw error if no token is provided', async () => {
    const next = jest.fn((err) => {
      expect(err).toBeInstanceOf(Error);
    });
    await isLoggedIn(
      {
        headers: {},
      },
      {},
      next
    );
    expect(next).toHaveBeenCalled();
  });

  it('should throw error if invalid token is provided', async () => {
    const next = jest.fn((err) => {
      expect(err).toBeInstanceOf(Error);
    });
    await isLoggedIn(
      {
        headers: {
          authorization: 'abc',
        },
      },
      {},
      next
    );
  });

  it('should proceed with callback function if user has admin access and admin is required', () => {
    const next = jest.fn();
    isAdmin(
      {
        user: {
          access: 'admin',
        },
      },
      {},
      next
    );
    expect(next).toHaveBeenCalled();
  });

  it("should throw error if admin is required but user doesn't have admin privilages", () => {
    const next = jest.fn((err) => {
      expect(err).toBeInstanceOf(Error);
    });
    isAdmin(
      {
        user: {
          access: 'user',
        },
      },
      {},
      next
    );
  });

  it('should throw error if admin is required but user object is not present', () => {
    const next = jest.fn((err) => {
      expect(err).toBeInstanceOf(Error);
    });
    isAdmin({}, {}, next);
  });
});
