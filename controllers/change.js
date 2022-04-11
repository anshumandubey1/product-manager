const Change = require("../models/change");

exports.list = async (req, res, next) => {
  try {
    const changes = await Change.findByProductId(req.params.id, req.query.page);
    res.status(200).json({
      success: true,
      changes
    });
  } catch (error) {
    next(error);
  }
}
