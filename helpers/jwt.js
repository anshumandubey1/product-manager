const jwt = require('jsonwebtoken');

exports.sign = (payload) => {
  return jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: '48h'
  });
};

exports.verify = (token) => new Promise((resolve, reject) => {
  jwt.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
    if (err) {
      return reject(err.message);
    } else {
      resolve(decoded);
    }
  });
});
