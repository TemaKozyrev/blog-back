import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import config from '../../config/config';
import User from '../models/user.model';
import Token from '../models/token.model';
import APIError from '../helpers/APIError';

function load(req, res, next, id) {
  User.get(id)
    .then((user) => {
      req.user = user; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

function get(req, res) {
  return res.json(req.user);
}

function create(req, res, next) {
  Token.get(req.body.token)
    .then((token) => {
      if (token.isActive) {
        token.isActive = false; // eslint-disable-line no-param-reassign
        token.save();
        const user = new User({
          username: req.body.username,
          password: req.body.password
        });

        user.save()
          .then((savedUser) => {

            const token = jwt.sign({
              username: savedUser.username,
              id: savedUser._id,
              isAdmin: savedUser.isAdmin,
            }, config.jwtSecret);

            res.json({
              token,
              username: savedUser.username,
              isAdmin: savedUser.isAdmin,
            });
          })
          .catch(e => next(e));
      } else {
        const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
        next(err);
      }
    });
}

function update(req, res, next) {
  const user = req.user;
  user.username = req.body.username;
  user.password = req.body.password;

  user.save()
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e));
}

function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  User.list({ limit, skip })
    .then(users => res.json(users))
    .catch(e => next(e));
}

function remove(req, res, next) {
  const user = req.user;
  user.remove()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e));
}

export default { load, get, create, update, list, remove };
