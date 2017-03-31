module.exports = (parameter, actual, options) => {
  if (typeof actual !== 'string') {
    return error();
  }

  if (!actual && !options.allowNull) {
    return error();
  }

  return { valid: true };

  function error() {
    return {
      error: options.errorCode === undefined ? `Expected parameter ${parameter} to be a string but it was ${JSON.stringify(actual)}` : options.errorCode,
      valid: false
    };
  }
}
