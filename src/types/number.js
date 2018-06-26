const util = require('../util');

module.exports = ({ parameter, value, options }) => {
  parameter = Array.isArray(parameter) ? parameter.join('.') : parameter;
  if (options.parse && typeof value === 'string') {
    value = util.parseType('number', value);
  }

  if (!options.allowNull && util.isNull(value)) {
    return {
      valid: false,
      errors: [
        options.nullCode ||
          options.errorCode ||
          `Expected parameter ${parameter} to be a number but it was ${JSON.stringify(
            value
          )}`
      ]
    };
  }

  if ((options.strict && typeof value !== 'number') || isNaN(value)) {
    return {
      valid: false,
      errors: [
        options.errorCode ||
          `Expected parameter ${parameter} to be a number but it was ${JSON.stringify(
            value
          )}`
      ]
    };
  }

  let parsed = parseFloat(value);
  if (isNaN(parsed) || parsed.toString() !== value.toString()) {
    return {
      valid: false,
      errors: [
        options.errorCode ||
          `Expected parameter ${parameter} to be a number but it was ${JSON.stringify(
            value
          )}`
      ]
    };
  }

  return { valid: true, parsed: value, errors: [] };
};
