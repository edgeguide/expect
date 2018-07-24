const { getDeep, getDeepOptions } = require('./getDeep');
const { parseType, parseFunctionWrapper } = require('./parse');

module.exports = function isEqualTo({
  value,
  type,
  equalTo,
  actualValues,
  expected
}) {
  const initialValue = getDeep(equalTo, actualValues);
  const options = getDeepOptions(equalTo, expected);

  const equalToValue =
    !options || !options.parse
      ? initialValue
      : typeof options.parse === 'function'
        ? parseFunctionWrapper({ value: initialValue, parse: options.parse })
        : parseType({ value: initialValue, type: options.type });

  return type === 'date'
    ? new Date(value).getTime() === new Date(equalToValue).getTime()
    : value === equalToValue;
};
