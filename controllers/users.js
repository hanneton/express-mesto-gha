const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
// const {
//   BAD_REQUEST,
//   NOT_FOUND,
//   INTERNAL,
// } = require('../errors/statuses');
const { NotFound } = require('../middlewares/not-found');

const login = (req, res, next) => {
  const { email } = req.body;
  User.findOne({ email })
    .select('+password')
    .orFail(() => { throw new NotFound(); })
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      res.send(token);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name,
    avatar,
    about,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        avatar,
        about,
        email,
        password: hash,
      });
    })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((data) => {
      res.send(data);
    })
    .catch(next);
};

const getUserByDefault = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(() => new Error('NOT_FOUND'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => { throw new NotFound(); })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => { throw new NotFound(); })
    .then((info) => {
      res.status(200).send(info);
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => { throw new NotFound(); })
    .then((info) => {
      res.send(info);
    })
    .catch(next);
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
  login,
  getUserByDefault,
};
