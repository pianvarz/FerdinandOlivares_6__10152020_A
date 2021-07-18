const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; 
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid User ID !';
    } else {
      User.findOne({ _id: userId })
        .then(user => {
          req.user = user;
          next();
        })
    }
  } catch(error) {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};