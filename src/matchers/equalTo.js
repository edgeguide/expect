module.exports = (parameter, expected, actualValues, options) => {
  let equalField = options.equalTo;

  let actual = actualValues[parameter];
  let equalValue = actualValues[equalField];

  if (options.type === 'date') {
    let error = '';
    if (!isDate(equalValue)) {
      error = `Expected ${equalValue} to be a date, but it wasn't. `;
    }
    if (!isDate(actual)) {
      error += `Expected ${actual} to be a date, but it wasn't.`;
    }
    if (error) {
      return {
        error,
        valid: false
      };
    }
    actual = new Date(actual).getTime();
    equalValue = new Date(equalValue).getTime();
  }

  if (actual !== equalValue) {
    return {
      error: options.equalToErrorCode === undefined ? `Expected parameter ${parameter} to be equal to ${equalField} but it wasn\'t. ${parameter}=${actual}, ${equalField}=${actualValues[equalField]}` : options.equalToErrorCode,
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
