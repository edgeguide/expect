const PHONE_REGEXP = /^\D?(\d{3,4})\D?\D?(\d{3})\D?(\d{4})$/;

const types = require('./types');
const matchers = require('./matchers');

module.exports = function(expected, actualValues, options) {
  var errors = {};
  options = options || {};
  actualValues = actualValues || {};
  var valid = true;

  Object.keys(expected).forEach(parameter => {
    let parameterOptions = typeof expected[parameter] === 'object' ? expected[parameter] : {};
    var actual = actualValues[parameter];
    var type = parameterOptions.type || expected[parameter];
    var allowNull =  parameterOptions.allowNull || false;

    let match = matchers.match(parameter, expected, actualValues, parameterOptions);

    if (!match.valid) {
      valid = false;
      errors[parameter] = match.error;
    }

    if ((allowNull || options.allowNull) && (actual === undefined || actual === null)) {
      return;
    }

    let validation = types.validate(type, parameter, actual, parameterOptions);
    if (!validation.valid) {
      valid = false;
      if (errors[parameter]) {
        errors[parameter] = Array.isArray(errors[parameter]) ? [...errors[parameter]] : [errors[parameter]];
        errors[parameter].push(validation.error);
      } else {
        errors[parameter] = validation.error;
      }
    }
  });

  return {
    wereMet: function() {
      return valid;
    },
    errors: function() {
      return errors;
    }
  };
};
