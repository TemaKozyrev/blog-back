import httpStatus from 'http-status';
import Token from '../models/token.model';
import APIError from '../helpers/APIError';
import nodemailer from 'nodemailer';

function create(req, res, next) {
  if (req.user.isAdmin) {
    const token = new Token({
      email: req.body.email,
      token: req.body.email,
    });

    token.save()
      .then((savedToken) => {

        const transporter = nodemailer.createTransport({ direct: true,
          host: 'smtp.yandex.ru',
          port: 465,
          auth: {
            user: 'noreply@tema.ws',
            pass: 'qvu94hpn10' },
          secure: true
        });

        const mailOptions = {
          from: 'noreply@tema.ws',
          to: req.body.email,
          subject: 'Your token',
          text: savedToken.token
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            return console.log(error);
          }
        });

        res.json(savedToken);
      })
      .catch(e => next(e));
  } else {
    const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
    next(err);
  }
}

export default { create };
