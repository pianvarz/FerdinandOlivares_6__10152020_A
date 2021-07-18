const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mailValidator = require('email-validator');
const passwordValidator = require('password-validator');

const User = require('../models/user');

var schema = new passwordValidator(); //Schema for password creation
 
schema
.is().min(6)                                    // Minimum length 6
.is().max(20)                                  // Maximum length 20
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits()                                 // Must have digits
.has().not().spaces()                           // Spaces are invalid
.is().not().oneOf(['Passw0rd', 'Password123']); // Invalid password inputs

exports.signup = (req, res, next) => {
  if (!mailValidator.validate(req.body.email) || (!schema.validate(req.body.password))) {  
    throw { error: "Invalid input please make sure include valid email; e.g. john@mail.com, and password with 6-20 characters including a lowercase and uppercase keys, a digit and no spaces!" }  
} else if (mailValidator.validate(req.body.email) && (schema.validate(req.body.password))) { 
  bcrypt.hash(req.body.password, 10)  
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({ message: 'User added successfully!' }))
        .catch(error => res.status(400).json({ error }));
    })

    .catch(error => res.status(500).json({ error: new Error('Invalid input please make sure include valid email; e.g. john@mail.com, and password with 6-20 characters including a lowercase and uppercase keys, a digit and no spaces!') }));
  }
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }).then(
      (user) => {
        if (!user) {
          return res.status(401).json({
            error: new Error('User not found!')
          });
        }
        bcrypt.compare(req.body.password, user.password).then(
          (valid) => {
            if (!valid) {
              return res.status(401).json({
                error: new Error('Incorrect password!')
              });
            }
            const token = jwt.sign(
              { userId: user._id },
              'RANDOM_TOKEN_SECRET',
              { expiresIn: '24h' });
            res.status(200).json({
              userId: user._id,
              token: token
            });
          }
        ).catch(
          (error) => {
            res.status(500).json({
              error: error
            });
          }
        );
      }
    ).catch(
      (error) => {
        res.status(500).json({
          error: error
        });
      }
  );
}