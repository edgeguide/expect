const XRegExp = require('xregexp');
const util = require('../util');

module.exports = (parameter, expected, actualValues, options) => {
  let actual = util.getDeep(parameter, actualValues);
  let regexp = options.regexp;
  parameter = Array.isArray(parameter) ? parameter.join('.') : parameter;

  if (
    Object.prototype.toString.apply(regexp) !== '[object RegExp]' &&
    typeof regexp !== 'string'
  ) {
    throw new Error(
      `${regexp} was expected to be a regexp object or a string but was ${Object.prototype.toString.apply(
        regexp
      )}`
    );
  }

  if (!XRegExp(regexp).test(actual)) {
    return {
      valid: false,
      errors:
        options.regexpErrorCode ||
        `${actual} did not match the regexp ${regexp}`
    };
  }

  return { valid: true, errors: [] };
};
