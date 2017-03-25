module.exports = (parameter, actual) => {
  if (!Array.isArray(actual)) {
    return {
      error: `Expected parameter ${parameter} to be an array but it was ${JSON.stringify(actual)}`,
      valid: false
    };
  }

  return { valid: true };
}
