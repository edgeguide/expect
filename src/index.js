const validateTypes = require('./types');
const { mergeErrors } = require('./util');

module.exports = function(expected, actualValues) {
  actualValues = actualValues || {};
  const parsedValues = {};
  let errors = {};
  let valid = true;

  Object.keys(expected).forEach(parameter => {
    const options =
      typeof expected[parameter] === 'object' ? expected[parameter] : {};
    const actual = actualValues[parameter];
    const type = options.type || expected[parameter];

    const validation = validateTypes({
      type,
      parameter,
      value: actual,
      options,
      actualValues,
      expected
    });

    if (!validation.valid) {
      valid = false;
      errors = mergeErrors(parameter, errors, validation.errors);
    }

    if (validation.parsed === null || validation.parsed === undefined) {
      parsedValues[parameter] = actual;
    } else {
      parsedValues[parameter] = validation.parsed;
    }
  });

  return {
    wereMet: () => valid,
    errors: () => errors,
    getParsed: () => parsedValues
  };
};
