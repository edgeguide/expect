const { isNull } = require('../util');

module.exports = ({ parameter, value, options }) => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return {
      valid: false,
      errors: [
        (isNull(value) && options.nullCode) ||
          options.errorCode ||
          `Expected parameter ${
            Array.isArray(parameter) ? parameter.join('.') : parameter
          } to be of type number but it was ${JSON.stringify(value)}`
      ]
    };
  }

  return { valid: true, parsed: value };
};
