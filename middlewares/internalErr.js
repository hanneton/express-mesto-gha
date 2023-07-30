const { INTERNAL } = require('../utils/error-statuses');

class InternalErr extends Error {
  constructor(message) {
    super(message);
    this.statusCode = INTERNAL;
  }
}

module.exports = InternalErr;
