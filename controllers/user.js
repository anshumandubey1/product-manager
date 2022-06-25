const { sign } = require('../services/jwt');
const User = require('../models/user');

exports.signUp = async (req, res, next) => {
  try {
    const user = await User.create({
      email: req.body.email,
      password: req.body.password,
    });
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await User.findByEmail(req.body.email);
    if (!user) {
      throw new Error('Email Not Found!');
    }
    if (!(await user.validatePassword(req.body.password))) {
      throw new Error('Incorrect Password!');
    }
    const token = sign({
      _id: user._id,
      email: user.email,
      access: user.access,
    });
    return res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    return next(error);
  }
};
