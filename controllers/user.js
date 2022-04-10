const User = require('../models/user');

exports.signUp = async (req, res, next) => {
  try {
    const user = new User({
      email: req.body.email,
      password: req.body.password
    });
    await user.save();
    return res.status(200).json({
      success: true,
      user
    })
  } catch (error) {
    return next(error);
  }
}