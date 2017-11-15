const util = require('../util');

module.exports = ({parameter, value, options}) => {
  parameter = Array.isArray(parameter) ? parameter.join('.') : parameter;

  if (options.parse) {
    value = util.parseType('boolean', value);
  }

  if (options.strict ? util.isNull(value) : false) {
    let errorCode = options.nullCode || options.errorCode;
    errorCode = errorCode ||  `Expected parameter ${parameter} to be a boolean but it was ${JSON.stringify(value)}`;

    return {
      errors: [errorCode],
      valid: false
    };
  }
  if (typeof value !== 'boolean' && (!options.strict ? typeof value !== 'undefined' : true)) {
    return {
      errors: [options.errorCode === undefined ? `Expected parameter ${parameter} to be a boolean but it was ${JSON.stringify(value)}` : options.errorCode],
      valid: false
    };
  }

  return { valid: true, parsed: value, errors: [] };
}
