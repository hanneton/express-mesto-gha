const Card = require('../models/card');
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL,
} = require('../errors/statuses');

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля' });
      } else {
        res.status(INTERNAL).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((data) => {
      res.send(data);
    })
    .catch(() => {
      res.status(INTERNAL).send({ message: 'На сервере произошла ошибка' });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        return Promise.reject(new Error('NOT_FOUND'));
      }
      return card;
    })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.message === 'NOT_FOUND') {
        res.status(NOT_FOUND).send({ message: 'Карточка или пользователь не найдены' });
      } else {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля' });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return Promise.reject(new Error('NOT_FOUND'));
      }
      return card;
    })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные в методы получения карточки или пользователя' });
      } else if (err.message === 'NOT_FOUND') {
        res.status(NOT_FOUND).send({ message: 'Карточка или пользователь не найдены' });
      } else {
        res.status(INTERNAL).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
const unlikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return Promise.reject(new Error('NOT_FOUND'));
      }
      return card;
    })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные в методы получения карточки или пользователя' });
      } else if (err.message === 'NOT_FOUND') {
        res.status(NOT_FOUND).send({ message: 'Карточка или пользователь не найдены' });
      } else {
        res.status(INTERNAL).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  unlikeCard,
};
