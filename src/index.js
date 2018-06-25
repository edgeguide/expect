const types = require('./types');
const util = require('./util');

module.exports = function(expected, actualValues) {
  actualValues = actualValues || {};
  const parsedValues = {};
  let errors = {};
  let valid = true;

  Object.keys(expected).forEach(parameter => {
    const options = typeof expected[parameter] === 'object' ? expected[parameter] : {};
    const actual = actualValues[parameter];
    const type = options.type || expected[parameter];

    let validation = types.validate({
      type,
      parameter,
      value: actual,
      options,
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
