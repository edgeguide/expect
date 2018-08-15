const { getDeep, getDeepOptions } = require('./getDeep');

module.exports = function isEqualTo({
  value,
  type,
  equalTo,
  actualValues,
  expected,
  validate
}) {
  const initialValue = getDeep(equalTo, actualValues);
  const options = getDeepOptions(equalTo, expected);

  const { parsed } = !options
    ? { parsed: initialValue }
    : validate({
      type: options.type || options,
      parameter: equalTo,
      value: initialValue,
      options,
      actualValues,
      expected
    });

  return type === 'date'
    ? new Date(value).getTime() === new Date(parsed).getTime()
    : value === parsed;
};
