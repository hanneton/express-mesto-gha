const { NOT_FOUND } = require('../utils/error-statuses');

class NotFoundErr extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NOT_FOUND;
    this.name = 'NotFound';
  }
}

module.exports = { NotFoundErr };
