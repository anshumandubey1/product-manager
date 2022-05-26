const jwt = require('jsonwebtoken');

class JsonWebTokenError extends Error {
  constructor(message) {
    super(message);
    this.name = 'JsonWebTokenError';
  }
}

exports.sign = (payload) => {
  return jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: '48h',
  });
};

exports.verify = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
      if (err) {
        return reject(new JsonWebTokenError(err.message));
      } else {
        resolve(decoded);
      }
    });
  });

exports.isLoggedIn = (req, res, next) => {
  const token = req.headers['authorization'] || req.headers['Authorization'];

  if (token) {
    exports
      .verify(token)
      .then((user) => {
        req.user = user;
        return next();
      })
      .catch((err) => {
        return next(err);
      });
  } else {
    return next(new JsonWebTokenError('No Token Supplied'));
  }
};

exports.isAdmin = (req, res, next) => {
  if (!req.user) {
    return next(new JsonWebTokenError('Authentication Required!'));
  }
  if (req.user.access === 'admin' || req.user.access === 'superadmin') {
    return next();
  }
  return next(new JsonWebTokenError('Admin Privilages Required!'));
};
