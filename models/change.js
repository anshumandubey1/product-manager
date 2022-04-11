const mongoose = require('mongoose');

const ChangeSchema = new mongoose.Schema(
    {
        from: {
          type: Number,
          required: true
        },
        to: {
          type: Number,
          required: true
        },
        userId: {
          type: mongoose.Types.ObjectId,
          ref: 'users',
          required: true
        },
        productId: {
          type: mongoose.Types.ObjectId,
          ref: 'users',
          required: true
        }
    },
    { timestamps: true },
    { collection: 'changes' }
);

ChangeSchema.index({productId: 1});

ChangeSchema.statics.findByProductId = (productId, page) => {
  const limit = 10;
  const skip = limit*(page-1);
  return Change.find({productId}).skip(skip).limit(limit);
};

const Change = mongoose.model('changes', ChangeSchema);
module.exports = Change;
