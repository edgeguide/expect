const util = require('../util');

module.exports = (parameter, actual, options) => {
  let result = checkValue();
  if (result.valid) {
    return result;
  }

  if (options.parse) {
    actual = JSON.parse(actual);
    return Object.assign({}, checkValue(actual), {
      parsed: actual
    });
  } else {
    return result;
  }

  function checkValue() {
    if (!options.allowNull && util.isNull(actual)) {
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

    if (options.strict && actual.length === 0) {
      return {
        error: [options.emptyErrorCode === undefined ? `Empty arrays are not allowed in strict mode (${parameter} was ${JSON.stringify(actual)})` : options.emptyErrorCode],
        valid: false
      };
    }

    return { valid: true, parsed: actual };
  }
}
