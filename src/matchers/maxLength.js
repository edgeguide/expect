const util = require('../util');

module.exports = (parameter, expected, actualValues, options) => {
  let actual = util.getDeep(parameter, actualValues);
  let length = getLength();

  if (isNaN(options.maxLength)) {
    throw new Error(`maxLength options for parameter ${parameter} was not a number`);
  }

  if (length > options.maxLength) {
    return {
      errors: options.maxLengthErrorCode === undefined ? `${actual} was longer than ${options.maxLength} (it was ${length})` : options.maxLengthErrorCode,
      valid: false
    };
  }

  return { valid : true, errors: [] };

  function getLength() {
    if (Array.isArray(actual)) {
      return actual.length;
    }

    if (typeof actual === 'string') {
      return actual.length;
    }

    if (typeof actual === 'number') {
      return actual.toString().length;
    }

    return undefined;
  }
}
