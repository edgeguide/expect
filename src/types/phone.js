const util = require('../util');

const PHONE_REGEXP = /^\D?[\d\s\(\)]+$/
const PHONE_REGEXP_STRICT = /^\D?(\d{3,4})\D?\D?(\d{3})\D?(\d{4})$/;

module.exports = ({parameter, value, options}) => {
  let regexp = options.strict ? PHONE_REGEXP_STRICT : PHONE_REGEXP;
  parameter = Array.isArray(parameter) ? parameter.join('.') : parameter;

  if (!options.allowNull && util.isNull(value)) {
    let errorCode = options.nullCode || options.errorCode;
    errorCode = errorCode || `Expected parameter ${parameter} to be a phone number but it was ${JSON.stringify(value)}`;

    return {
      errors: [errorCode],
      valid: false
    };
  }


  if (!regexp.test(value)) {
    return {
      errors: [options.errorCode === undefined ? `Expected parameter ${parameter} to be a phone number but it was incorrectly formatted: (${JSON.stringify(value)})` : options.errorCode],
      valid: false
    };
  }

  return { valid: true, errors: [] };
}
