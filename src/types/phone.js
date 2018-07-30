const PHONE_REGEXP = /^\+?[\d\s()]+$/;

module.exports = ({ parameter, value, options }) => {
  return PHONE_REGEXP.test(value)
    ? { valid: true }
    : {
      valid: false,
      errors: [
        options.errorCode ||
            `Expected parameter ${
              Array.isArray(parameter) ? parameter.join('.') : parameter
            } to be of type phone number but it was incorrectly formatted: (${JSON.stringify(
              value
            )})`
      ]
    };
};
