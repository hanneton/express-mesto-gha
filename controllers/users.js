const User = require('../models/user');
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL,
} = require('../errors/statuses');

const createUser = (req, res) => {
  const { name, avatar, about } = req.body;
  User.create({ name, avatar, about })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля' });
      } else {
        res.status(INTERNAL).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((data) => {
      res.send(data);
    })
    .catch(() => {
      res.status(INTERNAL).send({ message: 'На сервере произошла ошибка' });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(NOT_FOUND).send({ message: 'Карточка или пользователь не найдены' });
      } else {
        res.status(INTERNAL).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => new Error('NOT_FOUND'))
    .then((info) => {
      res.status(200).send(info);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля' });
      } else if (err.message === 'NOT_FOUND') {
        res.status(NOT_FOUND).send({ message: 'Карточка или пользователь не найдены' });
      } else {
        res.status(INTERNAL).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => new Error('NOT_FOUND'))
    .then((info) => {
      res.send(info);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(NOT_FOUND).send({ message: 'Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля' });
      } else if (err.message === 'NOT_FOUND') {
        res.status(NOT_FOUND).send({ message: 'Карточка или пользователь не найдены' });
      } else {
        res.status(INTERNAL).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
};
