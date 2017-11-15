const util = require('../util');
const IDENTITY_NUMBER_REGEXP = /^(?:19|20)?(\d{6}(?:-|\+)?\d{4})$/;
const IDENTITY_NUMBER_REGEXP_STRICT = /^(\d{6}(?:-|\+)?\d{4})$/;

module.exports = (parameter, actual, options) => {
  parameter = Array.isArray(parameter) ? parameter.join('.') : parameter;
  let regexp = options.strict ? IDENTITY_NUMBER_REGEXP_STRICT : IDENTITY_NUMBER_REGEXP;

  if (!options.allowNull && util.isNull(actual)) {
    let errorCode = options.nullCode || options.errorCode;

    return error(errorCode);
  }

  if (typeof actual !== 'string') {
    return error(options.errorCode);
  }

  let matches = actual.match(regexp);
  if (matches === null) {
    return error(options.errorCode);
  }

  if (!verifyLuhn(matches[1].replace(/(\+|-)/, ''))) {
    return error(options.errorCode);
  }

  return {
    valid: true,
    errors: []
  }

  function verifyLuhn(value) {
    let lastDigit = parseInt(value[value.length - 1]);
    let calculatedLastDigit = 0;
    for (var i = 0; i < 9; i++) {
      if (i % 2 === 0) {
        let result = 2 * parseInt(value[i]);
        let firstDigit = Math.floor(result/10);
        let secondDigit = result % 10;
        calculatedLastDigit += +(firstDigit + secondDigit);
      } else {
        calculatedLastDigit += parseInt(value[i]);
      }
    }
    calculatedLastDigit = (10 - (calculatedLastDigit % 10)) % 10;

    return lastDigit === calculatedLastDigit;
  }

  function error(errorCode) {
    errorCode = errorCode ||  `Expected parameter ${parameter} to be a personal identity number but it was ${JSON.stringify(actual)}`;
    return {
      errors: [errorCode],
      valid: false
    };
  }
}
