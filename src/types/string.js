const {
  parseType,
  parseFunctionWrapper,
  sanitize,
  containsUnsafe
} = require('../util');

module.exports = ({ parameter, value, options }) => {
  if (options.parse) {
    value =
      typeof options.parse === 'function'
        ? parseFunctionWrapper({ value, parse: options.parse })
        : parseType({ value, type: 'string' });
  }

  if (typeof value !== 'string') {
    return {
      valid: false,
      errors: [
        options.errorCode ||
          `Expected parameter ${
            Array.isArray(parameter) ? parameter.join('.') : parameter
          } to be of type string but it was ${JSON.stringify(value)}`
      ]
    };
  }

  if (
    options.blockUnsafe &&
    containsUnsafe({
      value,
      strict: options.strictEntities,
      allowed: options.allowed
    })
  ) {
    return {
      valid: false,
      errors: [
        options.unsafeErrorCode ||
          options.errorCode ||
          `Parameter ${
            Array.isArray(parameter) ? parameter.join('.') : parameter
          } contained unsafe, unescaped characters`
      ]
    };
  }

  return {
    valid: true,
    errors: [],
    parsed: options.sanitize
      ? sanitize({
        value,
        strict: options.strictEntities,
        allowed: options.allowed
      })
      : value
  };
};
