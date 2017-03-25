const PHONE_REGEXP = /^\D?(\d{3,4})\D?\D?(\d{3})\D?(\d{4})$/;
const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

module.exports = function(expectedValues, actualValues, options) {
  var errors = [];
  options = options || {};
  var valid = true;
  for (var key in expectedValues) {
    var actual = actualValues[key];
    var expected = typeof expectedValues[key] === 'object' ? expectedValues[key].type : expectedValues[key];
    var allowNull = typeof expectedValues[key] === 'object' ? expectedValues[key].allowNull : false;
    if (typeof expectedValues[key] === 'object') {
      if (expectedValues[key].hasOwnProperty('equalTo')) {
        let equalField = expectedValues[key].equalTo;
        if (actual !== actualValues[equalField]) {
          errors.push(`Expected parameter ${key} to be equal to ${equalField} but it wasn\'t. ${key}=${actual}, ${equalField}=${actualValues[equalField]}`);
          valid = false;
        }
      }
    }

    if ((allowNull || options.allowNull) && actual === undefined || actual === null) {
      continue;
    }
    switch (expected) {
      case 'phone': {
        if (!PHONE_REGEXP.test(actual)) {
          valid = false;
          errors.push(`Expected parameter ${key} to be a phone number but it was incorrectly formatted (${JSON.stringify(actual)})`);
        }
        break;
      } case 'email': {
        if (!EMAIL_REGEXP.test(actual)) {
          valid = false;
          errors.push(`Expected parameter ${key} to be an email address but it was incorrectly formatted (${JSON.stringify(actual)})`);
        }
        break;
      } case 'number':
        if (isNaN(parseFloat(actual))) {
          valid = false;
          errors.push(`Expected parameter ${key} to be a number but it was ${JSON.stringify(actual)}`);
        }
        break;
      case 'object':
        if (typeof actual !== 'object') {
          valid = false;
          errors.push(`Expected parameter ${key} to be an object but it was ${JSON.stringify(actual)}`);
        }
        break;
      case 'date':
        var testDate = new Date(actual);
        if (testDate.toString() === 'Invalid Date') {
          valid = false;
          errors.push(`Expected parameter ${key} to be a date but it was ${JSON.stringify(actual)}`);
        }
        break;
      case 'string':
        if (typeof actual !== 'string') {
          valid = false;
          errors.push(`Expected parameter ${key} to be a string but it was ${JSON.stringify(actual)}`);
        }
        break;
      case 'array':
        if (!Array.isArray(actual)) {
          valid = false;
          errors.push(`Expected parameter ${key} to be an array but it was ${JSON.stringify(actual)}`);
        }
        break;
      case 'boolean':
        if (typeof actual !== 'boolean' && typeof actual !== 'undefined') {
          valid = false;
          errors.push(`Expected parameter ${key} to be a boolean but it was ${JSON.stringify(actual)}`);
        }
        break;
      default:
    }
  }
  return {
    wereMet: function() {
      return valid;
    },
    errors: function() {
      return errors.join(', ');
    }
  };
};
