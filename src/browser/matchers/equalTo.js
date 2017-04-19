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