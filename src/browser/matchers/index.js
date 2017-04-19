'use strict';

var equalTo = require('./equalTo.js');
var regexp = require('./regexp.js');

module.exports = {
  match: match
};

function match(parameter, expected, actualValues, options) {
  var result = { valid: true, errors: [] };

  if (options.equalTo) {
    var _match = equalTo(parameter, expected, actualValues, options);
    if (!_match.valid) {
      result.valid = false;
      result.errors.push(_match.error);
    }
  }
  if (options.regexp) {
    var _match2 = regexp(parameter, expected, actualValues, options);
    if (!_match2.valid) {
      result.valid = false;
      result.errors.push(_match2.error);
    }
  }

  return result;
};