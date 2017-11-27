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
    let result = {valid: true, errors: []};

    if (!options.allowNull && util.isNull(value)) {
      let errorCode = options.nullCode || options.errorCode;
      errorCode = errorCode || `Expected ${JSON.stringify(value)} to be a string but it was ${typeof value}}`;

      return {
        errors: [errorCode],
        valid: false
      };
    }

    if (typeof value !== 'string') {
      return typeError();
    }

    if (!value && !options.allowNull) {
      return typeError();
    }

    if (options.sanitize) {
      let sanitized = util.sanitize({value, strict: options.strictEntities, allowed: options.allowed});
      result.parsed = sanitized;
    }

    if (options.blockUnsafe && util.containsUnsafe({value, strict: options.strictEntities, allowed: options.allowed})) {
      let errorCode = options.unsafeErrorCode || options.errorCode;
      errorCode = errorCode || `Parameter ${parameter} contained unsafe, unescaped characters`;

      return {
        errors: [errorCode],
        valid: false
      };
    }

    return result;
  }

  function typeError() {
    return {
      errors: [options.errorCode === undefined ? `Expected parameter ${parameter} to be a string but it was ${JSON.stringify(value)}` : options.errorCode],
      valid: false
    };
  }
}
