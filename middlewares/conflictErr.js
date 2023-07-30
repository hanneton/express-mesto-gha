const { CONFLICT } = require('../utils/error-statuses');

class ConflictErr extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CONFLICT;
    this.name = 'ConflictError';
  }
}

module.exports = { ConflictErr };
