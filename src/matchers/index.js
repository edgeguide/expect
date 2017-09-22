const equalTo = require('./equalTo');
const maxLength = require('./maxLength');
const minLength = require('./minLength');
const regexp = require('./regexp')

module.exports = {
  match
};

function match(parameter, expected, actualValues, options, expectations) {
  let result = { valid: true, errors: [] };

  if (options.equalTo) {
    let match = equalTo(parameter, expected, actualValues, options, expectations);
    if (!match.valid) {
      result.valid = false;
      result.errors.push(match.errors);
    }
  }

  if (options.regexp) {
    let match = regexp(parameter, expected, actualValues, options, expectations);
    if (!match.valid) {
      result.valid = false;
      result.errors.push(match.errors);
    }
  }

  if (options.maxLength) {
    let match = maxLength(parameter, expected, actualValues, options, expectations);
    if (!match.valid) {
      result.valid = false;
      result.errors.push(match.errors);
    }
  }

  if (options.minLength) {
    let match = minLength(parameter, expected, actualValues, options, expectations);
    if (!match.valid) {
      result.valid = false;
      result.errors.push(match.errors);
    }
  }

  return result;
};
