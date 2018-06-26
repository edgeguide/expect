const util = require('../util');

module.exports = ({ parameter, value, options }) => {
  parameter = Array.isArray(parameter) ? parameter.join('.') : parameter;

  if (options.parse) {
    value = util.parseType('boolean', value);
  }

  if (options.strict ? util.isNull(value) : false) {
    return {
      valid: false,
      errors: [
        options.nullCode ||
          options.errorCode ||
          `Expected parameter ${parameter} to be a boolean but it was ${JSON.stringify(
            value
          )}`
      ]
    };
  }
  if (
    typeof value !== 'boolean' &&
    (!options.strict ? typeof value !== 'undefined' : true)
  ) {
    return {
      valid: false,
      errors: [
        options.errorCode ||
          `Expected parameter ${parameter} to be a boolean but it was ${JSON.stringify(
            value
          )}`
      ]
    };
  }

  return { valid: true, parsed: value, errors: [] };
};
