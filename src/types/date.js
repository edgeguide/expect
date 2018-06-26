const util = require('../util');

module.exports = ({ parameter, value, options }) => {
  parameter = Array.isArray(parameter) ? parameter.join('.') : parameter;

  if (options.parse) {
    value = util.parseType('date', value);
  }

  const errorCode =
    options.errorCode ||
    `Expected parameter ${parameter} to be a date but it was ${JSON.stringify(
      value
    )}`;

  if (!options.allowNull && util.isNull(value)) {
    return { valid: false, errors: [options.nullCode || errorCode] };
  }

  if (typeof value === 'number') {
    return { valid: false, errors: [errorCode] };
  }

  const testDate = new Date(value);
  if (testDate.toString() === 'Invalid Date') {
    return { valid: false, errors: [errorCode] };
  }

  return { valid: true, parsed: value, errors: [] };
};
