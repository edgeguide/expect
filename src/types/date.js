const util = require('../util');

module.exports = (parameter, actual, options) => {
  if (options.parse) {
    actual = new Date(actual);
  }

  if (!options.allowNull && util.isNull(actual)) {
    let errorCode = options.nullCode || options.errorCode;
    errorCode = errorCode ||  `Expected parameter ${parameter} to be a date but it was ${JSON.stringify(actual)}`;

    return error(errorCode);
  }
  let errorCode = options.errorCode ||  `Expected parameter ${parameter} to be a date but it was ${JSON.stringify(actual)}`;
  if (typeof actual === 'number') {
    return error(errorCode);
  }

  var testDate = new Date(actual);
  if (testDate.toString() === 'Invalid Date') {
    return error(errorCode);
  }

  return { valid: true, parsed: actual };

  function error(errorCode) {
    return {
      error: [errorCode],
      valid: false
    };
  }
}
