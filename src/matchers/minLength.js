const util = require('../util');

module.exports = (parameter, expected, actualValues, options) => {
  let actual = util.getDeep(parameter, actualValues);
  let length = getLength();

  if (isNaN(options.minLength)) {
    throw new Error(
      `maxLength options for parameter ${parameter} was not a number`
    );
  }

  if (length < options.minLength) {
    return {
      valid: false,
      errors:
        options.minLengthErrorCode ||
        `${actual} was shorter than ${options.minLength} (it was ${length})`
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
