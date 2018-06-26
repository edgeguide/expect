const XRegExp = require('xregexp');
const util = require('../util');
const alphanumericRegexp = XRegExp('^[\\p{L}0-9\\s]+$');
const EMAIL_REGEXP = /.+@.+/;
const STRICT_EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

module.exports = ({ parameter, value, options }) => {
  parameter = Array.isArray(parameter) ? parameter.join('.') : parameter;
  let regexp = options.strict ? STRICT_EMAIL_REGEXP : EMAIL_REGEXP;
  if (!options.allowNull && util.isNull(value)) {
    return {
      valid: false,
      errors: [
        options.nullCode ||
          options.errorCode ||
          `Expected parameter ${parameter} to be an email address but it was ${JSON.stringify(
            value
          )}`
      ]
    };
  }

  if (!regexp.test(value)) {
    return {
      valid: false,
      errors: [
        options.errorCode ||
          `Expected parameter ${parameter} to be email address but it was incorrectly formatted: ${JSON.stringify(
            value
          )}`
      ]
    };
  }

  let allowedCharacters = Array.isArray(options.allowed)
    ? options.allowed.concat('@')
    : ['@']; // Always allow @ for email adresses, even when blocking unsafe
  if (
    options.blockUnsafe &&
    util.containsUnsafe({
      value,
      strict: options.strictEntities,
      allowed: allowedCharacters
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

  return { valid: true, errors: [] };
};
