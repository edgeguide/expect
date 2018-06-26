const util = require('../util');

module.exports = (parameter, expected, actualValues, options) => {
  let actual = util.getDeep(parameter, actualValues);
  let length = getLength();

  if (isNaN(options.maxLength)) {
    throw new Error(
      `maxLength options for parameter ${parameter} was not a number`
    );
  }

  if (length > options.maxLength) {
    return {
      valid: false,
      errors:
        options.maxLengthErrorCode ||
        `${actual} was longer than ${options.maxLength} (it was ${length})`
    };
  }

  return { valid: true, errors: [] };

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
};
