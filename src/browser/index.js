(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./matchers":3,"./types":10,"./util":15}],2:[function(require,module,exports){
'use strict';

module.exports = function (parameter, expected, actualValues, options) {
  var equalField = options.equalTo;

  var actual = actualValues[parameter];
  var equalValue = actualValues[equalField];

  if (isDate(actual) || isDate(equalValue)) {
    actual = new Date(actual).getTime();
    equalValue = new Date(equalValue).getTime();
  }

  if (actual !== equalValue) {
    return {
      error: options.equalToErrorCode === undefined ? 'Expected parameter ' + parameter + ' to be equal to ' + equalField + ' but it wasn\'t. ' + parameter + '=' + actual + ', ' + equalField + '=' + actualValues[equalField] : options.equalToErrorCode,
      valid: false
    };
  }

  return { valid: true };
};

function isDate(value) {
  if (value === null || value === undefined) {
    return false;
  }

  if (new Date(value).toString() === 'Invalid Date') {
    return false;
  }

  return true;
}

},{}],3:[function(require,module,exports){
'use strict';

var equalTo = require('./equalTo.js');
var regexp = require('./regexp.js');

module.exports = {
  match: match
};

function match(parameter, expected, actualValues, options) {
  var result = { valid: true, errors: [] };

  if (options.equalTo) {
    var _match = equalTo(parameter, expected, actualValues, options);
    if (!_match.valid) {
      result.valid = false;
      result.errors.push(_match.error);
    }
  }
  if (options.regexp) {
    var _match2 = regexp(parameter, expected, actualValues, options);
    if (!_match2.valid) {
      result.valid = false;
      result.errors.push(_match2.error);
    }
  }

  return result;
};

},{"./equalTo.js":2,"./regexp.js":4}],4:[function(require,module,exports){
'use strict';

module.exports = function (parameter, expected, actualValues, options) {
  var actual = actualValues[parameter];
  var regexp = options.regexp;

  if (Object.prototype.toString.apply(regexp) !== '[object RegExp]') {
    throw new Error(regexp + ' was expected to be a regexp object but was ' + Object.prototype.toString.apply(regexp));
  }

  if (!regexp.test(actual)) {
    return {
      error: options.regexpErrorCode === undefined ? 'Parameter ' + parameter + ' did not match the regexp ' + regexp : options.regexpErrorCode,
      valid: false
    };
  }

  return { valid: true };
};

},{}],5:[function(require,module,exports){
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

},{"../util":15}],6:[function(require,module,exports){
'use strict';

var util = require('../util');

module.exports = function (parameter, actual, options) {
  if (options.parse) {
    actual = JSON.parse(actual);
  }

  if (options.strict ? util.isNull(actual) : false) {
    var errorCode = options.nullCode || options.errorCode;
    errorCode = errorCode || 'Expected parameter ' + parameter + ' to be a boolean but it was ' + JSON.stringify(actual);

    return {
      error: [errorCode],
      valid: false
    };
  }
  if (typeof actual !== 'boolean' && (!options.strict ? typeof actual !== 'undefined' : true)) {
    return {
      error: [options.errorCode === undefined ? 'Expected parameter ' + parameter + ' to be a boolean but it was ' + JSON.stringify(actual) : options.errorCode],
      valid: false
    };
  }

  return { valid: true, parsed: actual };
};

},{"../util":15}],7:[function(require,module,exports){
'use strict';

var util = require('../util');

module.exports = function (parameter, actual, options) {
  if (options.parse) {
    actual = new Date(actual);
  }

  if (util.isNull(actual)) {
    var _errorCode = options.nullCode || options.errorCode;
    _errorCode = _errorCode || 'Expected parameter ' + parameter + ' to be a boolean but it was ' + JSON.stringify(actual);

    return error(_errorCode);
  }
  var errorCode = options.errorCode || 'Expected parameter ' + parameter + ' to be a boolean but it was ' + JSON.stringify(actual);
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

},{"../util":15}],8:[function(require,module,exports){
'use strict';

var util = require('../util');
var EMAIL_REGEXP = /.+@.+/;
var STRICT_EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

module.exports = function (parameter, actual, options) {
  var regexp = options.strict ? STRICT_EMAIL_REGEXP : EMAIL_REGEXP;
  if (util.isNull(actual)) {
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

},{"../util":15}],9:[function(require,module,exports){
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

},{"../util":15}],10:[function(require,module,exports){
'use strict';

var arrayValidation = require('./array');
var booleanValidation = require('./boolean');
var emailValidation = require('./email');
var numberValidation = require('./number');
var objectValidation = require('./object');
var phoneValidation = require('./phone');
var stringValidation = require('./string');
var dateValidation = require('./date');
var identityNumberValidation = require('./identityNumber');

module.exports = {
  validate: validate
};

function validate(type, parameter, value, parameterOptions) {
  switch (type) {
    case 'phone':
      return phoneValidation(parameter, value, parameterOptions);
    case 'email':
      return emailValidation(parameter, value, parameterOptions);
    case 'number':
      return numberValidation(parameter, value, parameterOptions);
    case 'object':
      return objectValidation(parameter, value, parameterOptions);
    case 'date':
      return dateValidation(parameter, value, parameterOptions);
    case 'string':
      return stringValidation(parameter, value, parameterOptions);
    case 'array':
      return arrayValidation(parameter, value, parameterOptions);
    case 'boolean':
      return booleanValidation(parameter, value, parameterOptions);
    case 'identityNumber':
      return identityNumberValidation(parameter, value, parameterOptions);
    default:
      throw new Error(parameter + ' could not be validated against type "' + type + '": it has not been defined');
      return;
  }
};

},{"./array":5,"./boolean":6,"./date":7,"./email":8,"./identityNumber":9,"./number":11,"./object":12,"./phone":13,"./string":14}],11:[function(require,module,exports){
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

},{"../util":15}],12:[function(require,module,exports){
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

},{"../util":15}],13:[function(require,module,exports){
'use strict';

var util = require('../util');

var PHONE_REGEXP = /^\D?[\d\s\(\)]+$/;
var PHONE_REGEXP_STRICT = /^\D?(\d{3,4})\D?\D?(\d{3})\D?(\d{4})$/;

module.exports = function (parameter, actual, options) {
  var regexp = options.strict ? PHONE_REGEXP_STRICT : PHONE_REGEXP;
  if (util.isNull(actual)) {
    var errorCode = options.nullCode || options.errorCode;
    errorCode = errorCode || 'Expected parameter ' + parameter + ' to be a phone number but it was ' + JSON.stringify(actual);

    return {
      error: [errorCode],
      valid: false
    };
  }

  if (!regexp.test(actual)) {
    return {
      error: [options.errorCode === undefined ? 'Expected parameter ' + parameter + ' to be a phone number but it was incorrectly formatted: (' + JSON.stringify(actual) + ')' : options.errorCode],
      valid: false
    };
  }

  return { valid: true };
};

},{"../util":15}],14:[function(require,module,exports){
'use strict';

var util = require('../util');

module.exports = function (parameter, actual, options) {

  var result = checkValue(actual);
  if (result.valid) {
    return result;
  }
  if (options.parse) {
    actual = JSON.stringify(actual);
    return Object.assign({}, checkValue(actual), {
      parsed: actual
    });
  } else {
    return result;
  }

  function checkValue() {
    if (util.isNull(actual)) {
      var errorCode = options.nullCode || options.errorCode;
      errorCode = errorCode || 'Expected parameter ' + parameter + ' to be a string but it was ' + JSON.stringify(actual);

      return {
        error: [errorCode],
        valid: false
      };
    }

    if (typeof actual !== 'string') {
      return error();
    }

    if (!actual && !options.allowNull) {
      return error();
    }

    return { valid: true };
  }

  function error() {
    return {
      error: [options.errorCode === undefined ? 'Expected parameter ' + parameter + ' to be a string but it was ' + JSON.stringify(actual) : options.errorCode],
      valid: false
    };
  }
};

},{"../util":15}],15:[function(require,module,exports){
'use strict';

module.exports = {
  isNull: isNull
};

function isNull(value) {
  if (value === undefined) {
    return true;
  }

  if (value === null) {
    return true;
  }

  if (value === '') {
    return true;
  }

  if (Array.isArray(value) && value.length === 0) {
    return true;
  }

  return false;
}

},{}]},{},[1]);
