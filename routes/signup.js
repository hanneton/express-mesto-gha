const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createUser } = require('../controllers/users');
const { regex } = require('../utils/regex-pattern');

router.post('/', celebrate(
  {
    body: {
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(regex),
    },
  },
), createUser);

module.exports = router;
