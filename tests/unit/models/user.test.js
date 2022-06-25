const { default: mongoose } = require('mongoose');
const User = require('../../../models/user');

require('../../database.test');
describe('User Model Test', () => {
  const user = {
    email: `usertest${Date.now()}@gmail.com`,
    password: 'password',
    access: 'user',
  };

  it('should add user to database when valid details are given', async () => {
    const newUser = await User.create(user);
    expect(mongoose.Types.ObjectId.isValid(newUser._id)).toBeTruthy();
    user._id = newUser._id;
  });
  it('should throw error when adding user to database when email already exists', async () => {
    await expect(
      User.create({
        email: user.email,
        password: 'human',
        access: 'admin',
      })
    ).rejects.toThrowError();
  });

  it('should get user from database when valid id is given', async () => {
    const getUser = await User.findById(user._id);
    expect(getUser.email).toBe(user.email);
  });

  it('should not save password in plain text', async () => {
    const getUser = await User.findById(user._id);
    expect(getUser.password).not.toBe(user.password);
  });

  it('should not encrypt password again when save is called', async () => {
    const getUser = await User.findById(user._id);
    getUser.access = 'admin';
    encryptedPassword = getUser.password;
    await getUser.save();
    const updatedUser = await User.findById(user._id);
    expect(updatedUser.password).toBe(encryptedPassword);
  });

  it('should return true if given password matches original password', async () => {
    const getUser = await User.findById(user._id);
    await expect(getUser.validatePassword(user.password)).resolves.toBeTruthy();
  });

  it("should return false if given password doesn't matches original password", async () => {
    const getUser = await User.findById(user._id);
    await expect(
      getUser.validatePassword(user.password + 'abc')
    ).resolves.toBeFalsy();
  });

  it('should be able to find user by email address', async () => {
    const getUser = await User.findByEmail(user.email);
    expect(getUser._id.equals(user._id)).toBeTruthy();
  });

  it('should delete user from database when valid id is given', async () => {
    const deletedUser = await User.findByIdAndDelete(user._id);
    expect(deletedUser).toBeTruthy();
  });
});
