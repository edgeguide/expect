const util = require('../util');

module.exports = (parameter, actual, options) => {
  parameter = Array.isArray(parameter) ? parameter.join('.') : parameter;
  if (options.parse && typeof actual === 'string') {
    actual = util.parseType('number', actual);
  }

  if (!options.allowNull && util.isNull(actual)) {
    let errorCode = options.nullCode || options.errorCode;
    errorCode = errorCode || `Expected parameter ${parameter} to be a number but it was ${JSON.stringify(actual)}`;

    return {
      errors: [errorCode],
      valid: false
    };
  }

  if (options.strict && typeof actual !== 'number' || isNaN(actual)) {
    return {
      errors: [options.errorCode === undefined ? `Expected parameter ${parameter} to be a number but it was ${JSON.stringify(actual)}` : options.errorCode],
      valid: false
    };
  }

  let parsed = parseFloat(actual);
  if (isNaN(parsed) || parsed.toString() !== actual.toString()) {
    return {
      errors: [options.errorCode === undefined ? `Expected parameter ${parameter} to be a number but it was ${JSON.stringify(actual)}` : options.errorCode],
      valid: false
    };
  }

  return { valid: true, parsed: actual, errors: []};
}
