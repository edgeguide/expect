const util = require('../util');

module.exports = ({parameter, value, options}) => {
  parameter = Array.isArray(parameter) ? parameter.join('.') : parameter;
  if (options.parse && typeof value === 'string') {
    value = util.parseType('number', value);
  }

  if (!options.allowNull && util.isNull(value)) {
    let errorCode = options.nullCode || options.errorCode;
    errorCode = errorCode || `Expected parameter ${parameter} to be a number but it was ${JSON.stringify(value)}`;

    return {
      errors: [errorCode],
      valid: false
    };
  }

  if (options.strict && typeof value !== 'number' || isNaN(value)) {
    return {
      errors: [options.errorCode === undefined ? `Expected parameter ${parameter} to be a number but it was ${JSON.stringify(value)}` : options.errorCode],
      valid: false
    };
  }

  let parsed = parseFloat(value);
  if (isNaN(parsed) || parsed.toString() !== value.toString()) {
    return {
      errors: [options.errorCode === undefined ? `Expected parameter ${parameter} to be a number but it was ${JSON.stringify(value)}` : options.errorCode],
      valid: false
    };
  }

  return { valid: true, parsed: value, errors: []};
}
