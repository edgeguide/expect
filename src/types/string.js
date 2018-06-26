const XRegExp = require('xregexp');
const util = require('../util');
const alphanumericRegexp = XRegExp('^[\\p{L}0-9\\s]+$');

module.exports = ({ parameter, value, options }) => {
  parameter = Array.isArray(parameter) ? parameter.join('.') : parameter;

  let result = checkValue(value);
  if (result.valid) {
    return result;
  }
  if (options.parse) {
    value = util.parseType('string', value);
    return Object.assign({}, checkValue(value), {
      parsed: value
    });
  } else {
    return result;
  }

  function checkValue() {
    let result = { valid: true, errors: [] };

    if (!options.allowNull && util.isNull(value)) {
      return {
        valid: false,
        errors: [
          options.nullCode ||
            options.errorCode ||
            `Expected parameter ${parameter} to be a string but it was value ${JSON.stringify(
              value
            )}`
        ]
      };
    }

    if (typeof value !== 'string') {
      return typeError();
    }

    if (!value && !options.allowNull) {
      return typeError();
    }

    if (options.alphanumeric && !alphanumericRegexp.test(value)) {
      return {
        valid: false,
        errors: [
          options.alphanumericErrorCode ||
            options.errorCode ||
            `Parameter ${parameter} contained non-alphanumeric characters`
        ]
      };
    }

    if (options.sanitize) {
      let sanitized = util.sanitize({
        value,
        strict: options.strictEntities,
        allowed: options.allowed
      });
      result.parsed = sanitized;
    }

    if (
      options.blockUnsafe &&
      util.containsUnsafe({
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
            `Parameter ${parameter} contained unsafe, unescaped characters`
        ]
      };
    }

    return result;
  }

  function typeError() {
    return {
      valid: false,
      errors: [
        options.errorCode ||
          `Expected parameter ${parameter} to be a string but it was ${JSON.stringify(
            value
          )}`
      ]
    };
  }
};
