'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var types = require('./types');
var matchers = require('./matchers');
var util = require('./util');

module.exports = function (expected, actualValues, options) {
  options = options || {};
  actualValues = actualValues || {};
  var _errors = {};
  var parsedValues = {};
  var valid = true;

  Object.keys(expected).forEach(function (parameter) {
    var parameterOptions = _typeof(expected[parameter]) === 'object' ? expected[parameter] : {};
    var actual = actualValues[parameter];
    var type = parameterOptions.type || expected[parameter];
    var allowNull = parameterOptions.allowNull || false;
    var requiredIf = parameterOptions.requiredIf || false;

    var validation = types.validate(type, parameter, actual, parameterOptions);

    if (requiredIf && util.isNull(validation.parsed)) {
      if (!actualValues[requiredIf]) {
        return;
      }
    }

    if ((allowNull || options.allowNull) && util.isNull(validation.parsed)) {
      return;
    }

    if (!validation.valid) {
      valid = false;
      if (_errors[parameter]) {
        _errors[parameter] = Array.isArray(_errors[parameter]) ? [].concat(_toConsumableArray(_errors[parameter])) : [_errors[parameter]];
        _errors[parameter] = _errors[parameter].concat(validation.error);
      } else {
        _errors[parameter] = validation.error;
      }
    }
    parsedValues[parameter] = validation.parsed || actual;
  });

  Object.keys(expected).forEach(function (parameter) {
    var parameterOptions = _typeof(expected[parameter]) === 'object' ? expected[parameter] : {};

    var matches = matchers.match(parameter, expected, parsedValues, parameterOptions);

    if (!matches.valid) {
      valid = false;
      if (_errors[parameter]) {
        _errors[parameter] = Array.isArray(_errors[parameter]) ? [].concat(_toConsumableArray(_errors[parameter])) : [_errors[parameter]];
        _errors[parameter] = _errors[parameter].concat(matches.errors);
      } else {
        _errors[parameter] = matches.errors;
      }
    }
  });

  return {
    wereMet: function wereMet() {
      return valid;
    },
    errors: function errors() {
      return _errors;
    },
    getParsed: function getParsed() {
      return parsedValues;
    }
  };
};