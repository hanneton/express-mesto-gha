const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL,
  CONFLICT,
  UNAUTHORIZED,
  FORBIDDEN,
} = require('../utils/error-statuses');

function errorsHandler(err, req, res, next) {
  switch (err.name) {
    case 'ForbiddenError':
      res.status(FORBIDDEN).send({ message: 'Доступ к странице ограничен' });
      break;
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
}

module.exports = { errorsHandler };
