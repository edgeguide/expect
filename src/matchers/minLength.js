module.exports = (parameter, expected, actualValues, options) => {
  let actual = actualValues[parameter];
  let length = getLength();

  if (isNaN(options.minLength)) {
    throw new Error(`maxLength options for parameter ${parameter} was not a number`);
  }

  if (length < options.minLength) {
    return {
      error: options.minLengthErrorCode === undefined ? `Parameter ${parameter} was shorter than ${options.minLength} (it was ${length})` : options.minLengthErrorCode,
      valid: false
    };
  }

  return { valid : true };

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
