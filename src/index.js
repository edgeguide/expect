const PHONE_REGEXP = /^\D?(\d{3,4})\D?\D?(\d{3})\D?(\d{4})$/;

const types = require('./types');
const matchers = require('./matchers');
const util = require('./util');

module.exports = function(expected, actualValues, options) {
  var errors = {};
  options = options || {};
  actualValues = actualValues || {};
  var valid = true;

  Object.keys(expected).forEach(parameter => {
    let parameterOptions = typeof expected[parameter] === 'object' ? expected[parameter] : {};
    let actual = actualValues[parameter];
    let type = parameterOptions.type || expected[parameter];
    let allowNull =  parameterOptions.allowNull || false;
    let requiredIf = parameterOptions.requiredIf || false;

    let matches = matchers.match(parameter, expected, actualValues, parameterOptions);

    if (!matches.valid) {
      valid = false;
      errors[parameter] = matches.errors;
    }

    if (requiredIf && util.isNull(actual)) {
      if (!actualValues[requiredIf]) {
        return;
      }
    }

    if ((allowNull || options.allowNull) && util.isNull(actual)) {
      return;
    }

    let validation = types.validate(type, parameter, actual, parameterOptions);
    if (!validation.valid) {
      valid = false;
      if (errors[parameter]) {
        errors[parameter] = Array.isArray(errors[parameter]) ? [...errors[parameter]] : [errors[parameter]];
        errors[parameter] = errors[parameter].concat(validation.error);
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
