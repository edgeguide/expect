const equalTo = require('./equalTo.js');
const regexp = require('./regexp.js')

module.exports = {
  match
};

function match(parameter, expected, actualValues, options) {
  let result = { valid: true, errors: [] };

  if (options.equalTo) {
    let match = equalTo(parameter, expected, actualValues, options);
    if (!match.valid) {
      result.valid = false;
      result.errors.push(match.error);
    }
  }
  if (options.regexp) {
    let match = regexp(parameter, expected, actualValues, options);
    if (!match.valid) {
      result.valid = false;
      result.errors.push(match.error);
    }
  }

  return result;
};
