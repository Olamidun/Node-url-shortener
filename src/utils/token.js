const jwt = require('jsonwebtoken');

const generateToken = (user) => jwt.sign({
  _id: user.id,
}, `${process.env.SECRET}` || 'somethingsecret', {
  expiresIn: '10d',
});

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(400).json({
      message: 'Access denied, please check your token!',
    });
  }
  const token = authorization.slice(7, authorization.length);
  jwt.verify(token, `${process.env.SECRET}` || 'somethingsecret', (err, decode) => {
    if (err) {
      res.status(401).send({ message: 'Access denied,Invalid Token' });
    } else {
      req.user = decode;
      // console.log(req.user)

      next();
    }
  });
};

module.exports = { generateToken, auth };
