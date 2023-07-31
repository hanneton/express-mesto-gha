const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { regex } = require('./utils/regex-pattern');

// const { BadRequest } = require('./middlewares/bad-request');
// const { Internal } = require('./middlewares/internal');

const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL,
  CONFLICT,
  UNAUTHORIZED,
} = require('./utils/error-statuses');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.post('/signin', celebrate(
  {
    body: {
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(regex),
    },
  },
), login);
app.post('/signup', celebrate(
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

app.use(auth);
// app.use((req, res, next) => {
//   req.user = {
//     _id: '64ac7425a17718ab37621345',
//   };
//   next();
// });
app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);
app.use('*', (req, res) => {
  res.status(404).send({ message: 'Карточка или пользователь не найдены' });
});

app.use(errors());

app.use((err, req, res, next) => {
  switch (err.name) {
    case 'UnauthorizedError':
      res.status(UNAUTHORIZED).send({ message: 'Неверные логин или пароль' });
      break;
    case 'ConflictError':
      res.status(CONFLICT).send({ message: 'Такой пользователь уже зарегистрирован' });
      break;
    case 'CastError':
      res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля' });
      break;
    case 'ValidationError':
      res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля' });
      break;
    case 'NotFound':
      res.status(NOT_FOUND).send({ message: 'Карточка или пользователь не найдены' });
      break;
    default:
      res.status(INTERNAL).send({ message: 'На сервере произошла ошибка' });
  }
  next();
});

app.listen(PORT);
