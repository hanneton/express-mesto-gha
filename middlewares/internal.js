const { INTERNAL } = require('../errors/statuses');

class Internal extends Error {
  constructor(message) {
    super(message);
    this.statusCode = INTERNAL;
  }
}

module.exports = Internal;
