module.exports = (parameter, expected, actualValues, options) => {
  let actual = actualValues[parameter];
  let regexp = options.regexp;

  if (Object.prototype.toString.apply(regexp) !== '[object RegExp]') {
    throw new Error(`${regexp} was expected to be a regexp object but was ${Object.prototype.toString.apply(regexp)}`);
  }

  if (!regexp.test(actual)) {
    return {
      errors: options.regexpErrorCode === undefined ? `Parameter ${parameter} did not match the regexp ${regexp}` : options.regexpErrorCode,
      valid: false
    };
  }

  return { valid : true, errors: [] };
}
