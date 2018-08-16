// eslint-disable-next-line no-undef
if (typeof window !== 'undefined' && !window._babelPolyfill) {
  require('babel-polyfill');
}

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
      errors[parameter] = validation.error;
    }
  });

  return {
    wereMet: () => valid,
    errors: () => errors,
    getParsed: () => parsedValues
  };
};
