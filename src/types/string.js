module.exports = (parameter, actual, options) => {
  if (typeof actual !== 'string') {
    return {
      error: options.errorCode === undefined ? `Expected parameter ${parameter} to be a string but it was ${JSON.stringify(actual)}` : options.errorCode,
      valid: false
    };
  }

  return { valid: true };
}
