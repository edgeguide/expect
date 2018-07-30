const validateTypes = require('./types');

module.exports = function(expected, actualValues) {
  actualValues = actualValues || {};
  const parsedValues = {};
  const errors = {};
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

    if (validation.valid) {
      parsedValues[parameter] = validation.parsed;
    } else {
      valid = false;
      errors[parameter] = validation.errors;
    }
  });

  return {
    wereMet: () => valid,
    errors: () => errors,
    getParsed: () => parsedValues
  };
};
