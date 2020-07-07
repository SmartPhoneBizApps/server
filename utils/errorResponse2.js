class ErrorResponse2 extends Error {
  constructor(message) {
    super(message);

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorResponse2;
