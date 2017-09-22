const util = require('../util');

module.exports = (parameter, actual, options) => {
  if (options.parse) {
    actual = util.parseType('boolean', actual);
  }

  if (options.strict ? util.isNull(actual) : false) {
    let errorCode = options.nullCode || options.errorCode;
    errorCode = errorCode ||  `Expected parameter ${parameter} to be a boolean but it was ${JSON.stringify(actual)}`;

    return {
      errors: [errorCode],
      valid: false
    };
  }
  if (typeof actual !== 'boolean' && (!options.strict ? typeof actual !== 'undefined' : true)) {
    return {
      errors: [options.errorCode === undefined ? `Expected parameter ${parameter} to be a boolean but it was ${JSON.stringify(actual)}` : options.errorCode],
      valid: false
    };
  }

  return { valid: true, parsed: actual, errors: [] };
}
