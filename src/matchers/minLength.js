module.exports = (parameter, expected, actualValues, options) => {
  parameter = Array.isArray(parameter) ? parameter.join('.') : parameter;
  let actual = actualValues[parameter];
  let length = getLength();

  if (isNaN(options.minLength)) {
    throw new Error(`maxLength options for parameter ${parameter} was not a number`);
  }

  if (length < options.minLength) {
    return {
      errors: options.minLengthErrorCode === undefined ? `Parameter ${parameter} was shorter than ${options.minLength} (it was ${length})` : options.minLengthErrorCode,
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
