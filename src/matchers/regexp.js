const XRegExp = require('xregexp/src');
const util = require('../util');

module.exports = (parameter, expected, actualValues, options) => {
  let actual = util.getDeep(parameter, actualValues);
  let regexp = options.regexp;
  parameter = Array.isArray(parameter) ? parameter.join('.') : parameter;

  if (Object.prototype.toString.apply(regexp) !== '[object RegExp]' && typeof regexp !== 'string') {
    throw new Error(`${regexp} was expected to be a regexp object or a string but was ${Object.prototype.toString.apply(regexp)}`);
  }

  if (!XRegExp(regexp).test(actual)) {
    return {
      errors: options.regexpErrorCode === undefined ? `${actual} did not match the regexp ${regexp}` : options.regexpErrorCode,
      valid: false
    };
  }

  return { valid : true, errors: [] };
}
