const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NotFoundErr } = require('../middlewares/notFoundErr');
const { ConflictErr } = require('../middlewares/conflictErr');

const login = (req, res, next) => {
  const { email } = req.body;
  User.findOne({ email })
    .select('+password')
    .orFail(() => { throw new NotFoundErr(); })
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

const createUser = (req, res) => {
  const {
    name,
    avatar,
    about,
    email,
    password,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictErr();
      }
      return bcrypt.hash(password, 10)
        .then(() => {
          User.create({
            name,
            avatar,
            about,
            email,
            password,
          })
            .then((newUser) => {
              res.status(201).send({
                name: newUser.name,
                avatar: newUser.avatar,
                about: newUser.about,
                email: newUser.email,
              });
            });
        });
    })
    .catch((err) => {
      res.status(err.statusCode).send({ message: 'Такой пользователь уже зарегистрирован' });
    });
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
    .orFail(() => { throw new NotFoundErr(); })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => { throw new NotFoundErr(); })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => { throw new NotFoundErr(); })
    .then((info) => {
      res.status(200).send(info);
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => { throw new NotFoundErr(); })
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
