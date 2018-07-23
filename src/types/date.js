const { parseType, parseFunctionWrapper } = require('../util');

module.exports = ({ parameter, value, options }) => {
  parameter = Array.isArray(parameter) ? parameter.join('.') : parameter;

  if (options.parse) {
    value =
      typeof options.parse === 'function'
        ? parseFunctionWrapper({ value, parse: options.parse })
        : parseType({ value, type: 'date' });
  }

  return (value instanceof Date || typeof value === 'string') &&
    new Date(value).toString() !== 'Invalid Date'
    ? { valid: true, parsed: value, errors: [] }
    : {
      valid: false,
      errors: [
        options.errorCode ||
            `Expected parameter ${parameter} to be of type date but it was ${JSON.stringify(
              value
            )}`
      ]
    };
};
