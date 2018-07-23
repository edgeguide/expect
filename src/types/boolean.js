const { parseType, parseFunctionWrapper, isNull } = require('../util');

module.exports = ({ parameter, value, options }) => {
  if (options.parse) {
    value =
      typeof options.parse === 'function'
        ? parseFunctionWrapper({ value, parse: options.parse })
        : parseType({ value, type: 'boolean' });
  }

  if (typeof value !== 'boolean') {
    return {
      valid: false,
      errors: [
        (isNull(value) && options.nullCode) ||
          options.errorCode ||
          `Expected parameter ${
            Array.isArray(parameter) ? parameter.join('.') : parameter
          } to be of type boolean but it was ${JSON.stringify(value)}`
      ]
    };
  }

  return { valid: true, parsed: value, errors: [] };
};
