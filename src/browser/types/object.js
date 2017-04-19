'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var util = require('../util');

module.exports = function (parameter, actual, options) {
  if (Array.isArray(actual)) {
    return error();
  }

  if (util.isNull(actual)) {
    var errorCode = options.nullCode || options.errorCode;
    errorCode = errorCode || 'Expected parameter ' + parameter + ' to be an object but it was ' + JSON.stringify(actual);

    return {
      error: [errorCode],
      valid: false
    };
  }

  if ((typeof actual === 'undefined' ? 'undefined' : _typeof(actual)) !== 'object') {
    return error();
  }

  return { valid: true };

  function error() {
    return {
      error: [options.errorCode === undefined ? 'Expected parameter ' + parameter + ' to be an object but it was ' + JSON.stringify(actual) : options.errorCode],
      valid: false
    };
  }
};