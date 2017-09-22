const util = require('../util');

module.exports = (parameter, actual, options, validate) => {
  if (options.keys) {
    let valid = true;
    let validation = objectTypeCheck(parameter, actual, options);
    if (!validation.valid) {
      return validation;
    }

    let parsed = {};
    let errors = {};

    if (options.strictKeyCheck) {
      let checkedKeys = Object.keys(options.keys);
      let uncheckedKeys = Object.keys(actual).filter(key => {
        return !checkedKeys.includes(key);
      });

      if (uncheckedKeys.length > 0) {
        valid = false;
        errors[parameter] = [options.errorCode || `Object contained unchecked keys "${uncheckedKeys.join(', ')}"`]
      }
    }

    let invalidKeys = Object.keys(options.keys).filter(key => {
      let keyOptions = typeof options.keys[key] === 'object' ? options.keys[key] : {};
      let keyType = typeof options.keys[key] === 'object' ? options.keys[key].type : options.keys[key];

      let validation = validate({
        type: keyType,
        parameter: `${parameter}.${key}`,
        value: actual[key],
        parameterOptions: keyOptions
      });
      if (validation.errors && validation.errors.length > 0) {
        errors[`${parameter}.${key}`] = validation.errors;
      }
      parsed[key] = validation.parsed ? validation.parsed : actual[key];
      return !validation.valid;
    });

    if (invalidKeys.length > 0 || errors[parameter] && errors[parameter].length > 0) {
      valid = false;

      return {
        valid,
        errors: [errors]
      };
    } else {
      return {valid, parsed: parsed};
    }
  }

  return objectTypeCheck(parameter, actual, options);
}

function objectTypeCheck(parameter, actual, options) {
  if (Array.isArray(actual)) {
    return error();
  }

  if (!options.allowNull && util.isNull(actual)) {
    let errorCode = options.nullCode || options.errorCode;
    errorCode = errorCode || `Expected parameter ${parameter} to be an object but it was ${JSON.stringify(actual)}`;

    return {
      errors: [errorCode],
      valid: false
    };
  }

  if (typeof actual !== 'object') {
    return error();
  }

  return { valid: true, errors: [] };

  function error() {
    return {
      errors: [options.errorCode === undefined ? `Expected parameter ${parameter} to be an object but it was ${JSON.stringify(actual)}` : options.errorCode],
      valid: false
    };
  }
}
