const { getDeep } = require('./getDeep');
const { parseType, parseFunctionWrapper } = require('./parse');

module.exports = function equalTo({ value, actualValues, options, expected }) {
  const equalField = options.equalTo;
  let equalValue = getDeep(equalField, actualValues);

  if (options.parse) {
    value =
      typeof options.parse === 'function'
        ? parseFunctionWrapper({ value, parse: options.parse })
        : parseType({ value, type: options.type });
  }

  if (expected[equalField] && expected[equalField].parse) {
    equalValue =
      typeof expected[equalField].parse === 'function'
        ? parseFunctionWrapper({
          value: equalValue,
          parse: expected[equalField].parse
        })
        : parseType({ value: equalValue, type: expected[equalField].type });
  }

  if (
    options.type === 'date'
      ? new Date(value).getTime() !== new Date(equalValue).getTime()
      : value !== equalValue
  ) {
    return {
      valid: false,
      errors: [
        options.equalToErrorCode ||
          `Expected ${value} to be equal to ${equalValue} but it was not.`
      ]
    };
  }

  return { valid: true };
};
