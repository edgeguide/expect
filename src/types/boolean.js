module.exports = ({ parameter, value, options }) => {
  return typeof value === 'boolean'
    ? { valid: true }
    : {
      valid: false,
      errors: [
        options.errorCode ||
            `Expected parameter ${
              Array.isArray(parameter) ? parameter.join('.') : parameter
            } to be of type boolean but it was ${JSON.stringify(value)}`
      ]
    };
};
