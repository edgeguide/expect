const util = require('../util');

const PHONE_REGEXP = /^\+?[\d\s\(\)]+$/;

module.exports = ({ parameter, value, options }) => {
  parameter = Array.isArray(parameter) ? parameter.join('.') : parameter;

  if (!options.allowNull && util.isNull(value)) {
    return {
      valid: false,
      errors: [
        options.nullCode ||
          options.errorCode ||
          `Expected parameter ${parameter} to be a phone number but it was ${JSON.stringify(
            value
          )}`
      ]
    };
  }

  if (!PHONE_REGEXP.test(value)) {
    return {
      valid: false,
      errors: [
        options.errorCode ||
          `Expected parameter ${parameter} to be a phone number but it was incorrectly formatted: (${JSON.stringify(
            value
          )})`
      ]
    };
  }

  return { valid: true, errors: [] };
};
