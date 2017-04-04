module.exports = (parameter, actual, options) => {
  if (isNaN(parseFloat(actual)) || (options.strict ? typeof actual !== 'number' : false)) {
    return {
      error: [options.errorCode === undefined ? `Expected parameter ${parameter} to be a number but it was ${JSON.stringify(actual)}` : options.errorCode],
      valid: false
    };
  }

  return { valid: true };
}
