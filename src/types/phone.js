const util = require('../util');

const PHONE_REGEXP = /^\D?[\d\s\(\)]+$/
const PHONE_REGEXP_STRICT = /^\D?(\d{3,4})\D?\D?(\d{3})\D?(\d{4})$/;

module.exports = (parameter, actual, options) => {
  let regexp = options.strict ? PHONE_REGEXP_STRICT : PHONE_REGEXP;
  if (util.isNull(actual)) {
    let errorCode = options.nullCode || options.errorCode;
    errorCode = errorCode || `Expected parameter ${parameter} to be a phone number but it was ${JSON.stringify(actual)}`;

    return {
      error: [errorCode],
      valid: false
    };
  }


  if (!regexp.test(actual)) {
    return {
      error: [options.errorCode === undefined ? `Expected parameter ${parameter} to be a phone number but it was incorrectly formatted: (${JSON.stringify(actual)})` : options.errorCode],
      valid: false
    };
  }

  return { valid: true };
}
