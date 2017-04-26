'use strict';

var util = require('../util');

module.exports = function (parameter, actual, options) {
  if (options.parse) {
    actual = new Date(actual);
  }

  if (!options.allowNull && util.isNull(actual)) {
    var _errorCode = options.nullCode || options.errorCode;
    _errorCode = _errorCode || 'Expected parameter ' + parameter + ' to be a date but it was ' + JSON.stringify(actual);

    return error(_errorCode);
  }
  var errorCode = options.errorCode || 'Expected parameter ' + parameter + ' to be a date but it was ' + JSON.stringify(actual);
  if (typeof actual === 'number') {
    return error(errorCode);
  }

  var testDate = new Date(actual);
  if (testDate.toString() === 'Invalid Date') {
    return error(errorCode);
  }

  return { valid: true, parsed: actual };

  function error(errorCode) {
    return {
      error: [errorCode],
      valid: false
    };
  }
};