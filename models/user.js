const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const UserSchema = new mongoose.Schema(
    {
        email: {
          type: String,
          required: true,
          unique: true
        },
        password: {
          type: String,
          required: true
        },
        access: {
          type: String,
          enum: ['superadmin', 'admin', 'user'],
          default: 'user'
        }
    },
    { timestamps: true },
    { collection: 'users' }
);

UserSchema.pre('save', async function(next) {
  try {
    if(!this.isModified('password'))
      return next();
    this.password = await bcrypt.hash(this.password, saltRounds);
    return next();
  } catch (error) {
    return next(error);
  }
});

UserSchema.index({email: 1});

UserSchema.statics.getByEmail = (email) => {
    return User.findOne({ email });
};

const User = mongoose.model('users', UserSchema);
module.exports = User;
