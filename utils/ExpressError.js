class ExpressError extends Error {
  constructor (message, statsCode) {
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
}

module.exports = ExpressError;