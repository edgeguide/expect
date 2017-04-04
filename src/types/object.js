module.exports = (parameter, actual, options) => {
  if (actual === null || actual === undefined || Array.isArray(actual)) {
    return error();
  }

  if (typeof actual !== 'object') {
    return error();
  }

  return { valid: true };

  function error() {
    return {
      error: [options.errorCode === undefined ? `Expected parameter ${parameter} to be an object but it was ${JSON.stringify(actual)}` : options.errorCode],
      valid: false
    };
  }
}
