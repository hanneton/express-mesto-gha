const { INTERNAL } = require('../utils/error-statuses');

class Internal extends Error {
  constructor(message) {
    super(message);
    this.statusCode = INTERNAL;
  }
}

module.exports = Internal;
