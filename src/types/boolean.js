module.exports = (parameter, actual, options) => {
  if (typeof actual !== 'boolean' && (!options.strict ? typeof actual !== 'undefined' : true)) {
    return {
      error: [options.errorCode === undefined ? `Expected parameter ${parameter} to be a boolean but it was ${JSON.stringify(actual)}` : options.errorCode],
      valid: false
    };
  }

  return { valid: true };
}
