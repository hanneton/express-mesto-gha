const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const signUpRoute = require('./routes/signup');
const signInRoute = require('./routes/signin');
const auth = require('./middlewares/auth');
const { NotFoundErr } = require('./middlewares/notFoundErr');
const { errorsHandler } = require('./middlewares/errorsHandler');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());

app.use('/signup', signUpRoute);
app.use('/signin', signInRoute);

app.use(auth);

app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);
app.use('*', () => {
  throw new NotFoundErr();
});

app.use(errors());

app.use(errorsHandler);

app.listen(PORT);
