'use strict';

var util = require('../util');

module.exports = function (parameter, actual, options) {
  var result = checkValue();
  if (result.valid) {
    return result;
  }

  if (options.parse) {
    actual = JSON.parse(actual);
    return Object.assign({}, checkValue(actual), {
      parsed: actual
    });
  } else {
    return result;
  }

  function checkValue() {
    if (util.isNull(actual)) {
      var errorCode = options.nullCode || options.errorCode;
      errorCode = errorCode || 'Expected parameter ' + parameter + ' to be an array but it was ' + JSON.stringify(actual);
      return {
        error: [errorCode],
        valid: false
      };
    }
    if (!Array.isArray(actual)) {
      return {
        error: [options.errorCode === undefined ? 'Expected parameter ' + parameter + ' to be an array but it was ' + JSON.stringify(actual) : options.errorCode],
        valid: false
      };
    }

    return { valid: true, parsed: actual };
  }
};