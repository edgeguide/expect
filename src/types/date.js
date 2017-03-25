module.exports = (parameter, actual) => {
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
      error: `Expected parameter ${parameter} to be a date but it was ${JSON.stringify(actual)}`,
      valid: false
    };
  }
}
