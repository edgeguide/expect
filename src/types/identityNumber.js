const util = require('../util');
const IDENTITY_NUMBER_REGEXP = /^(?:19|20)?(\d{6}(?:-|\+)?\d{4})$/;
const IDENTITY_NUMBER_REGEXP_STRICT = /^(\d{6}(?:-|\+)?\d{4})$/;

module.exports = ({ parameter, value, options }) => {
  parameter = Array.isArray(parameter) ? parameter.join('.') : parameter;
  let regexp = options.strict
    ? IDENTITY_NUMBER_REGEXP_STRICT
    : IDENTITY_NUMBER_REGEXP;

  const errorCode =
    options.errorCode ||
    `Expected parameter ${parameter} to be a personal identity number but it was ${JSON.stringify(
      value
    )}`;

  if (!options.allowNull && util.isNull(value)) {
    return { valid: false, errors: [options.nullCode || errorCode] };
  }

  if (typeof value !== 'string') {
    return { valid: false, errors: [errorCode] };
  }

  const matches = value.match(regexp);
  if (matches === null) {
    return { valid: false, errors: [errorCode] };
  }

  if (!verifyLuhn(matches[1].replace(/(\+|-)/, ''))) {
    return { valid: false, errors: [errorCode] };
  }

  return {
    valid: true,
    errors: []
  };

  function verifyLuhn(value) {
    const lastDigit = parseInt(value[value.length - 1]);
    let calculatedLastDigit = 0;
    for (var i = 0; i < 9; i++) {
      if (i % 2 === 0) {
        let result = 2 * parseInt(value[i]);
        let firstDigit = Math.floor(result / 10);
        let secondDigit = result % 10;
        calculatedLastDigit += +(firstDigit + secondDigit);
      } else {
        calculatedLastDigit += parseInt(value[i]);
      }
    }
    calculatedLastDigit = (10 - (calculatedLastDigit % 10)) % 10;

    return lastDigit === calculatedLastDigit;
  }
};
