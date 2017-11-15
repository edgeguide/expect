const util = require('../util');

module.exports = ({parameter, value, options}) => {
  parameter = Array.isArray(parameter) ? parameter.join('.') : parameter;

  let result = checkValue(value);
  if (result.valid) {
    return result;
  }
  if (options.parse) {
    value = util.parseType('string', value);
    return Object.assign({}, checkValue(value), {
      parsed: value
    });
  } else {
    return result;
  }

  function checkValue() {
    if (!options.allowNull && util.isNull(value)) {
      let errorCode = options.nullCode || options.errorCode;
      errorCode = errorCode || `Expected ${JSON.stringify(value)} to be a string but it was ${typeof value}}`;

      return {
        errors: [errorCode],
        valid: false
      };
    }


    if (typeof value !== 'string') {
      return error();
    }

    if (!value && !options.allowNull) {
      return error();
    }

    return {valid: true, errors: []};
  }

  function error() {
    return {
      errors: [options.errorCode === undefined ? `Expected parameter ${parameter} to be a string but it was ${JSON.stringify(value)}` : options.errorCode],
      valid: false
    };
  }
}
