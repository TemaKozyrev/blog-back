import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import APIError from '../helpers/APIError';

const SALT_WORK_FACTOR = 10;

const TokenSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  token: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

TokenSchema.pre('save', function (next) {
  const token = this;

  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(token.token, salt, (err, hash) => {
      if (err) return next(err);

      if (token.token === token.email) token.token = hash;
      next();
    });
  });
});


TokenSchema.statics = {
  get(token) {
    return this.findOne({ token })
      .exec()
      .then((token) => {
        if (token) {
          return token;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  }
};

export default mongoose.model('Token', TokenSchema);
