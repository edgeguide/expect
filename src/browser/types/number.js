'use strict';

var util = require('../util');

module.exports = function (parameter, actual, options) {
  if (options.parse) {
    actual = parseFloat(actual);
  }

  if (util.isNull(actual)) {
    var errorCode = options.nullCode || options.errorCode;
    errorCode = errorCode || 'Expected parameter ' + parameter + ' to be a number but it was ' + JSON.stringify(actual);

    return {
      error: [errorCode],
      valid: false
    };
  }

  if (isNaN(parseFloat(actual)) || (options.strict ? typeof actual !== 'number' : false)) {
    return {
      error: [options.errorCode === undefined ? 'Expected parameter ' + parameter + ' to be a number but it was ' + JSON.stringify(actual) : options.errorCode],
      valid: false
    };
  }

  return { valid: true, parsed: actual };
};