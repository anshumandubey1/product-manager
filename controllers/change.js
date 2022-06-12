const Change = require('../models/change');

exports.list = async (req, res, next) => {
  try {
    const changes = await Change.findByProductId(req.params.id, req.query.page);
    res.status(200).json({
      success: true,
      changes,
    });
  } catch (error) {
    next(error);
  }
};

exports.view = async (req, res, next) => {
  try {
    const change = await Change.findById(req.params.cid);
    if (!change) {
      throw new Error('No change found for given id');
    }
    res.status(200).json({
      success: true,
      change,
    });
  } catch (error) {
    next(error);
  }
};
