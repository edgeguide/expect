const equality = require('./equality.js');

module.exports = {
  match
};

function match(parameter, expected, actualValues, options) {
  if (expected[parameter].hasOwnProperty('equalTo')) {
    return equality.test(parameter, expected, actualValues, options);
  }

  return { valid: true };
};
