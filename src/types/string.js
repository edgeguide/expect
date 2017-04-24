const util = require('../util');

module.exports = (parameter, actual, options) => {

  let result = checkValue(actual);
  if (result.valid) {
    return result;
  }
  if (options.parse) {
    actual = JSON.stringify(actual);
    return Object.assign({}, checkValue(actual), {
      parsed: actual
    });
  } else {
    return result;
  }

  function checkValue() {
    if (!options.allowNull && util.isNull(actual)) {
      let errorCode = options.nullCode || options.errorCode;
      errorCode = errorCode || `Expected parameter ${parameter} to be a string but it was ${JSON.stringify(actual)}`;

      return {
        error: [errorCode],
        valid: false
      };
    }


    if (typeof actual !== 'string') {
      return error();
    }

    if (!actual && !options.allowNull) {
      return error();
    }

    return {valid: true};
  }

  function error() {
    return {
      error: [options.errorCode === undefined ? `Expected parameter ${parameter} to be a string but it was ${JSON.stringify(actual)}` : options.errorCode],
      valid: false
    };
  }
}
