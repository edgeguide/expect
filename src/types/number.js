const util = require('../util');

module.exports = (parameter, actual, options) => {
  if (util.isNull(actual)) {
    let errorCode = options.nullCode || options.errorCode;
    errorCode = errorCode || `Expected parameter ${parameter} to be a number but it was ${JSON.stringify(actual)}`;

    return {
      error: [errorCode],
      valid: false
    };
  }

  if (isNaN(parseFloat(actual)) || (options.strict ? typeof actual !== 'number' : false)) {
    return {
      error: [options.errorCode === undefined ? `Expected parameter ${parameter} to be a number but it was ${JSON.stringify(actual)}` : options.errorCode],
      valid: false
    };
  }

  return { valid: true };
}
