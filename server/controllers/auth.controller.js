import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../../config/config';
import User from '../models/user.model';

function login(req, res, next) {
  console.log('login');
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err || !user) {
      const err = new APIError('login', httpStatus.UNAUTHORIZED, true);
      return next(err);
    } else {
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (err) {
          const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
          return next(err);
        }
        if (isMatch) {
          const token = jwt.sign({
            username: user.username,
            id: user._id,
            isAdmin: user.isAdmin,
          }, config.jwtSecret);
          return res.json({
            token,
            username: user.username,
            isAdmin: user.isAdmin,
          });
        } else {
          const err = new APIError('password', httpStatus.UNAUTHORIZED, true);
          return next(err);
        }
      });
    }
  });
}

function getRandomNumber(req, res) {
  // req.user is assigned by jwt middleware if valid token is provided
  return res.json({
    user: req.user,
    num: Math.random() * 100
  });
}

export default { login, getRandomNumber };
