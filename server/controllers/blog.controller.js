import httpStatus from 'http-status';
import Blog from '../models/blog.model';
import APIError from '../helpers/APIError';

function create(req, res, next) {
  if (req.user.isAdmin) {
    const blog = new Blog({
      text: req.body.text,
    });

    blog.save()
      .then(savedBlog => res.json(savedBlog))
      .catch(e => next(e));
  } else {
    const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
    next(err);
  }
}

function list(req, res, next) {
  const { limit = 10, skip = 0 } = req.query;
  Blog.list({ limit, skip })
    .then(blogs => res.json(blogs))
    .catch(e => next(e));
}

function count(req, res, next) {
  Blog.count()
    .then(blogs => res.json(blogs.length))
    .catch(e => next(e));
}

export default { create, list, count };
