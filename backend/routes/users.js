const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(result => {
          res.status(201).json({
            message: 'User created!',
          });
        })
        .catch(err => {
          res.status(500).json({
            error: err
          })
        });
    })
});

router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({email: req.body.email})
    .then(user => {
      fetchedUser = user;
      if (!user) {
        return res.status(401).json({
          message: 'User not found!'
        })
      }
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: 'Auth failed, password is incorrect!'
        })
      }
      const token = jwt.sign(
        {email: fetchedUser.email, userId: fetchedUser._id},
        'this-is-very-long-secret-key',
        {expiresIn: '1h'}
      );
      res.status(200).json({
        message: 'Login successfully!',
        token: token
      });
    })
    .catch(err => {
      return res.status(404).json({
        message: 'Auth failed',
        error: err
      })
    })
});

module.exports = router;

