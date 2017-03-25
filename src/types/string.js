module.exports = (parameter, actual) => {  
  if (typeof actual !== 'string') {
    return {
      error: `Expected parameter ${parameter} to be a string but it was ${JSON.stringify(actual)}`,
      valid: false
    };
  }

  return { valid: true };
}
