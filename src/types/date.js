module.exports = (parameter, actual, options) => {
  if (actual === null || actual === undefined) {
    return error();
  }
  if (typeof actual === 'number') {
    return error();
  }

  var testDate = new Date(actual);
  if (testDate.toString() === 'Invalid Date') {
    return error();
  }

  return { valid: true };

  function error() {
    return {
      error: [options.errorCode === undefined ? `Expected parameter ${parameter} to be a date but it was ${JSON.stringify(actual)}` : options.errorCode],
      valid: false
    };
  }
}
