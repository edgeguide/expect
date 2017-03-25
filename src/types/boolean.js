module.exports = (parameter, actual, options) => {

  if (typeof actual !== 'boolean' && (options.allowUndefined ? typeof actual !== 'undefined' : true)) {
    return {
      error: `Expected parameter ${parameter} to be a boolean but it was ${JSON.stringify(actual)}`,
      valid: false
    };
  }

  return { valid: true };
}
