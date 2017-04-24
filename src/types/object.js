const util = require('../util');

module.exports = (parameter, actual, options) => {
  if (Array.isArray(actual)) {
    return error();
  }

  if (!options.allowNull && util.isNull(actual)) {
    let errorCode = options.nullCode || options.errorCode;
    errorCode = errorCode || `Expected parameter ${parameter} to be an object but it was ${JSON.stringify(actual)}`;

    return {
      error: [errorCode],
      valid: false
    };
  }

  if (typeof actual !== 'object') {
    return error();
  }

  return { valid: true };

  function error() {
    return {
      error: [options.errorCode === undefined ? `Expected parameter ${parameter} to be an object but it was ${JSON.stringify(actual)}` : options.errorCode],
      valid: false
    };
  }
}
