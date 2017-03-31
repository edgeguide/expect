module.exports = {
  test
};

function test(parameter, expected, actualValues, options) {
  let actual = actualValues[parameter];
  let equalField = expected[parameter].equalTo;

  let value = actualValues[parameter];
  let equalValue = actualValues[equalField];

  if (isDate(value) || isDate(equalValue)) {
    value = new Date(value).getTime();
    equalValue = new Date(equalValue).getTime();
  }

  if (value !== equalValue) {
    return {
      error: options.equalityErrorCode === undefined ? `Expected parameter ${parameter} to be equal to ${equalField} but it wasn\'t. ${parameter}=${actual}, ${equalField}=${actualValues[equalField]}` : options.equalityErrorCode,
      valid: false
    };
  }

  return { valid : true };
}

function isDate(value) {
  if (value === null || value === undefined) {
    return false;
  }

  if (new Date(value).toString() === 'Invalid Date') {
    return false;
  }

  return true;
}
