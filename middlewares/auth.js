const jwt = require('jsonwebtoken');
const { UnauthorizedErr } = require('./unauthorizedErr');

function authorize(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer: ')) {
    throw new UnauthorizedErr();
  }
  const token = authorization.replace('Bearer: ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new UnauthorizedErr();
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
  return null;
}
module.exports = authorize;
