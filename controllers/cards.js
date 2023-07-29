const Card = require('../models/card');
// const {
//   BAD_REQUEST,
//   NOT_FOUND,
//   INTERNAL,
// } = require('../errors/statuses');
const { NotFound } = require('../middlewares/not-found');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch(next);
};

const getCards = (req, res, next) => {
  Card.find({})
    .then((data) => {
      res.send(data);
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.deleteOne({ _id: cardId, owner: req.user._id })
    .then((card) => {
      if (card.deletedCount === 0) {
        throw new NotFound();
      }
      return card;
    })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFound();
      }
      return card;
    })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch(next);
};
const unlikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFound();
      }
      return card;
    })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch(next);
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  unlikeCard,
};
