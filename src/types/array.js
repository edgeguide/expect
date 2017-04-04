module.exports = (parameter, actual, options) => {
  if (!Array.isArray(actual)) {
    return {
      error: [options.errorCode === undefined ? `Expected parameter ${parameter} to be an array but it was ${JSON.stringify(actual)}` : options.errorCode],
      valid: false
    };
  }

  return { valid: true };
}
