const PHONE_REGEXP = /^\D?[\d\s\(\)]+$/
const PHONE_REGEXP_STRICT = /^\D?(\d{3,4})\D?\D?(\d{3})\D?(\d{4})$/;

module.exports = (parameter, actual, options) => {
  let regexp = options.strict ? PHONE_REGEXP_STRICT : PHONE_REGEXP;
  if (!regexp.test(actual)) {
    return {
      error: `Expected parameter ${parameter} to be a phone number but it was incorrectly formatted: (${JSON.stringify(actual)})`,
      valid: false
    };
  }

  return { valid: true };
}
