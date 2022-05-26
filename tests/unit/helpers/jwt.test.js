require('../../database.test');
describe('JWT Helper tests', () => {
  it('should add user to database when unique email id and a password is given', async () => {});

  it.todo('should verify a signed token when same TOKEN SECRET is used');

  it.todo('should put user data in req.user if valid token is provided');

  it.todo('should throw error if invalid/no token is provided');

  it.todo(
    'should proceed with callback function if user has admin access and admin is required'
  );

  it.todo(
    "should throw error if admin is required but user doesn't have admin privilages"
  );
});
