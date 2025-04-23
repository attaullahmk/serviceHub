class ExpressError extends Error {
    constructor(status, message) {
      super(message);
      this.status = status;
  
      // Capture the stack trace for debugging purposes
      // Error.captureStackTrace(this, this.constructor);
    }
  }
  
  module.exports = ExpressError;
  