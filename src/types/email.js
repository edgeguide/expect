const XRegExp = require('xregexp');
const { containsUnsafe } = require('../util');
const alphanumericRegexp = XRegExp('^[\\p{L}0-9\\s]+$');
const EMAIL_REGEXP = /.+@.+/;
const STRICT_EMAIL_REGEXP = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

module.exports = ({ parameter, value, options }) => {
  parameter = Array.isArray(parameter) ? parameter.join('.') : parameter;

  const regexp = options.strict ? STRICT_EMAIL_REGEXP : EMAIL_REGEXP;
  if (typeof value !== 'string' || !regexp.test(value)) {
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

  const allowedCharacters = Array.isArray(options.allowed)
    ? options.allowed.concat('@')
    : ['@']; // Always allow @ for email adresses, even when blocking unsafe

  if (
    options.blockUnsafe &&
    containsUnsafe({
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

  return { valid: true };
};
