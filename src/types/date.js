const util = require('../util');

module.exports = ({parameter, value, options}) => {
  parameter = Array.isArray(parameter) ? parameter.join('.') : parameter;

  if (options.parse) {
    value = util.parseType('date', value);
  }

  if (!options.allowNull && util.isNull(value)) {
    let errorCode = options.nullCode || options.errorCode;
    errorCode = errorCode ||  `Expected parameter ${parameter} to be a date but it was ${JSON.stringify(value)}`;

    return error(errorCode);
  }
  let errorCode = options.errorCode ||  `Expected parameter ${parameter} to be a date but it was ${JSON.stringify(value)}`;
  if (typeof value === 'number') {
    return error(errorCode);
  }

  var testDate = new Date(value);
  if (testDate.toString() === 'Invalid Date') {
    return error(errorCode);
  }

  return { valid: true, parsed: value, errors: [] };

  function error(errorCode) {
    return {
      errors: [errorCode],
      valid: false
    };
  }
}
