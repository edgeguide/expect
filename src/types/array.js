const util = require('../util');

module.exports = (parameter, actual, options) => {

  let parse = options.parse;

  if (parse) {
    actual = JSON.parse(actual);
  }

  if (util.isNull(actual)) {
    let errorCode = options.nullCode || options.errorCode;
    errorCode = errorCode ||  `Expected parameter ${parameter} to be an array but it was ${JSON.stringify(actual)}`;
    return {
      error: [errorCode],
      valid: false
    };
  }
  if (!Array.isArray(actual)) {
    return {
      error: [options.errorCode === undefined ? `Expected parameter ${parameter} to be an array but it was ${JSON.stringify(actual)}` : options.errorCode],
      valid: false
    };
  }

  return { valid: true, parsed: actual };
}
