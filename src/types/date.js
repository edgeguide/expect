module.exports = ({ parameter, value, options }) => {
  return (value instanceof Date || typeof value === 'string') &&
    new Date(value).toString() !== 'Invalid Date'
    ? { valid: true }
    : {
      valid: false,
      errors: [
        options.errorCode ||
            `Expected parameter ${
              Array.isArray(parameter) ? parameter.join('.') : parameter
            } to be of type date but it was ${JSON.stringify(value)}`
      ]
    };
};
