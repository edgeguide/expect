const types = require('./types');
const util = require('./util');

module.exports = function(expected, actualValues, options) {
  options = options || {};
  actualValues = actualValues || {};
  let errors = {};
  let parsedValues = {};
  let valid = true;

  Object.keys(expected).forEach(parameter => {
    let parameterOptions = typeof expected[parameter] === 'object' ? expected[parameter] : {};
    let actual = actualValues[parameter];
    let type = parameterOptions.type || expected[parameter];

    let validation = types.validate({
      type,
      parameter,
      value: actual,
      parameterOptions,
      actualValues,
      expected
    });

    if (!validation.valid) {
      valid = false;
      errors = util.mergeErrors(parameter, errors, validation.errors);
    }

    if (validation.parsed === null || validation.parsed === undefined) {
      parsedValues[parameter] = actual;
    } else {
      parsedValues[parameter] = validation.parsed;
    }
  });

  return {
    wereMet: function() {
      return valid;
    },
    errors: function() {
      return errors;
    },
    getErrors: function(chain) {
      return util.getErrors(chain, errors);
    },
    getParsed: function() {
      return parsedValues;
    }
  };
};
