'use strict';

var util = require('../util');
var IDENTITY_NUMBER_REGEXP = /^(?:19|20)?(\d{6}(?:-|\+)?\d{4})$/;
var IDENTITY_NUMBER_REGEXP_STRICT = /^(\d{6}(?:-|\+)?\d{4})$/;

module.exports = function (parameter, actual, options) {
  var regexp = options.strict ? IDENTITY_NUMBER_REGEXP_STRICT : IDENTITY_NUMBER_REGEXP;

  if (util.isNull(actual)) {
    var errorCode = options.nullCode || options.errorCode;

    return error(errorCode);
  }

  if (typeof actual !== 'string') {
    return error(options.errorCode);
  }

  var matches = actual.match(regexp);
  if (matches === null) {
    return error(options.errorCode);
  }

  if (!verifyLuhn(matches[1].replace(/(\+|-)/, ''))) {
    return error(options.errorCode);
  }

  return {
    valid: true
  };

  function verifyLuhn(value) {
    var lastDigit = parseInt(value[value.length - 1]);
    var calculatedLastDigit = 0;
    for (var i = 0; i < 9; i++) {
      if (i % 2 === 0) {
        var result = 2 * parseInt(value[i]);
        var firstDigit = Math.floor(result / 10);
        var secondDigit = result % 10;
        calculatedLastDigit += +(firstDigit + secondDigit);
      } else {
        calculatedLastDigit += parseInt(value[i]);
      }
    }
    calculatedLastDigit = (10 - calculatedLastDigit % 10) % 10;

    return lastDigit === calculatedLastDigit;
  }

  function error(errorCode) {
    errorCode = errorCode || 'Expected parameter ' + parameter + ' to be a personal identity number but it was ' + JSON.stringify(actual);
    return {
      error: [errorCode],
      valid: false
    };
  }
};