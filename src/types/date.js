const util = require('../util');

module.exports = (parameter, actual, options) => {
  if (util.isNull(actual)) {
    let errorCode = options.nullCode || options.errorCode;
    errorCode = errorCode ||  `Expected parameter ${parameter} to be a boolean but it was ${JSON.stringify(actual)}`;

    return error(errorCode);
  }
  let errorCode = options.errorCode ||  `Expected parameter ${parameter} to be a boolean but it was ${JSON.stringify(actual)}`;
  if (typeof actual === 'number') {
    return error(errorCode);
  }

  var testDate = new Date(actual);
  if (testDate.toString() === 'Invalid Date') {
    return error(errorCode);
  }

  return { valid: true };

  function error(errorCode) {
    return {
      error: [errorCode],
      valid: false
    };
  }
}
