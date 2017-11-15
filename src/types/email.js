const util = require('../util');
const EMAIL_REGEXP = /.+@.+/;
const STRICT_EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

module.exports = ({parameter, value, options}) => {
  parameter = Array.isArray(parameter) ? parameter.join('.') : parameter;
  let regexp = options.strict ? STRICT_EMAIL_REGEXP : EMAIL_REGEXP;
  if (!options.allowNull && util.isNull(value)) {
    let errorCode = options.nullCode || options.errorCode;
    errorCode = errorCode || `Expected parameter ${parameter} to be an email address but it was ${JSON.stringify(value)}`;


    return {
      errors: [errorCode],
      valid: false
    };
  }

  if (!regexp.test(value)) {
    return {
      errors: [options.errorCode === undefined ? `Expected parameter ${parameter} to be email address but it was incorrectly formatted: ${JSON.stringify(value)}` : options.errorCode],

      valid: false
    };
  }

  return { valid: true, errors: [] };
}
