import express from 'express';
import validate from 'express-validation';
import blogCtrl from '../controllers/blog.controller';
import paramValidation from '../../config/param-validation';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  .get(blogCtrl.list)

  .post(validate(paramValidation.createPost), blogCtrl.create);

router.route('/count')
  .get(blogCtrl.count);

export default router;
