const { UNAUTHORIZED } = require('../utils/error-statuses');

class UnauthorizedErr extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED;
    this.name = 'UnauthorizedError';
  }
}

module.exports = { UnauthorizedErr };
