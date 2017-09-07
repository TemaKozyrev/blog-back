import express from 'express';
import tokenCtrl from '../controllers/token.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  .post(tokenCtrl.create);

export default router;
