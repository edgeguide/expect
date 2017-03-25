module.exports = (parameter, actual) => {
  if (isNaN(parseFloat(actual))) {
    return {
      error: `Expected parameter ${parameter} to be a number but it was ${JSON.stringify(actual)}`,
      valid: false
    };
  }

  return { valid: true };
}
