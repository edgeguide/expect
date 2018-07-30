const IDENTITY_NUMBER_REGEXP = /^(?:19|20)?(\d{6}(?:-|\+)?\d{4})$/;
const IDENTITY_NUMBER_REGEXP_STRICT = /^(\d{6}(?:-|\+)?\d{4})$/;

module.exports = ({ parameter, value, options }) => {
  const regexp = options.strict
    ? IDENTITY_NUMBER_REGEXP_STRICT
    : IDENTITY_NUMBER_REGEXP;

  const errorCode =
    options.errorCode ||
    `Expected parameter ${
      Array.isArray(parameter) ? parameter.join('.') : parameter
    } to be of type personal identity number but it was ${JSON.stringify(
      value
    )}`;

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

  return { valid: true };
};

function verifyLuhn(value) {
  const lastDigit = parseInt(value[value.length - 1]);
  let calculatedLastDigit = 0;
  for (var i = 0; i < 9; i++) {
    if (i % 2 === 0) {
      const result = 2 * parseInt(value[i]);
      const firstDigit = Math.floor(result / 10);
      const secondDigit = result % 10;
      calculatedLastDigit += +(firstDigit + secondDigit);
    } else {
      calculatedLastDigit += parseInt(value[i]);
    }
  }
  calculatedLastDigit = (10 - (calculatedLastDigit % 10)) % 10;

  return lastDigit === calculatedLastDigit;
}
