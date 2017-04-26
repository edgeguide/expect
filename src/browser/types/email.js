'use strict';

var util = require('../util');
var EMAIL_REGEXP = /.+@.+/;
var STRICT_EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

module.exports = function (parameter, actual, options) {
  var regexp = options.strict ? STRICT_EMAIL_REGEXP : EMAIL_REGEXP;
  if (!options.allowNull && util.isNull(actual)) {
    var errorCode = options.nullCode || options.errorCode;
    errorCode = errorCode || 'Expected parameter ' + parameter + ' to be an email address but it was ' + JSON.stringify(actual);

    return {
      error: [errorCode],
      valid: false
    };
  }

  if (!regexp.test(actual)) {
    return {
      error: [options.errorCode === undefined ? 'Expected parameter ' + parameter + ' to be email address but it was incorrectly formatted: ' + JSON.stringify(actual) : options.errorCode],
      valid: false
    };
  }

  return { valid: true };
};