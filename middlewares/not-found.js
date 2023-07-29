const { NOT_FOUND } = require('../utils/error-statuses');

class NotFound extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NOT_FOUND;
    this.name = 'NotFound';
  }
}

module.exports = { NotFound };
