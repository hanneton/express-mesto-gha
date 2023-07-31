const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcryptjs');
const { regex } = require('../utils/regex-pattern');

const userScheme = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (str) => regex.test(str),
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (str) => isEmail(str),
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});
userScheme.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта и пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта и пароль'));
          }
          return user;
        });
    });
};
const User = mongoose.model('user', userScheme);

module.exports = User;
