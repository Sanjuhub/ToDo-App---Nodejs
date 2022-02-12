const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const accessToken = req.cookies.JWT_TOKEN;

  if (accessToken === 'null') {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  jwt.verify(accessToken, process.env.JWT_SECRET_TOKEN, (err, payload) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
    req.user = payload;
    next();
  });
};
