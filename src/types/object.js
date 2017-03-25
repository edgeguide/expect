module.exports = (parameter, actual) => {
  if (actual === null || actual === undefined || Array.isArray(actual)) {
    return error();
  }

  if (typeof actual !== 'object') {
    return error();
  }

  return { valid: true };

  function error() {
    return {
      error: `Expected parameter ${parameter} to be an object but it was ${JSON.stringify(actual)}`,
      valid: false
    };
  }
}
