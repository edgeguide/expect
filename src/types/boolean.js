const util = require('../util');

module.exports = (parameter, actual, options) => {
  if (options.strict ? util.isNull(actual) : false) {
    let errorCode = options.nullCode || options.errorCode;
    errorCode = errorCode ||  `Expected parameter ${parameter} to be a boolean but it was ${JSON.stringify(actual)}`;

    return {
      error: [errorCode],
      valid: false
    };
  }
  if (typeof actual !== 'boolean' && (!options.strict ? typeof actual !== 'undefined' : true)) {
    return {
      error: [options.errorCode === undefined ? `Expected parameter ${parameter} to be a boolean but it was ${JSON.stringify(actual)}` : options.errorCode],
      valid: false
    };
  }

  return { valid: true };
}
