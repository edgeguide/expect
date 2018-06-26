const util = require('../util');

module.exports = ({ parameter, value, actualValues, options, validate }) => {
  if (!options.keys) {
    return objectTypeCheck(parameter, value, options);
  }

  let valid = true;
  let validation = objectTypeCheck(parameter, value, options);
  if (!validation.valid) {
    return validation;
  }

  let parsed = {};
  let errors = {};

  if (options.strictKeyCheck) {
    let checkedKeys = Object.keys(options.keys);
    let uncheckedKeys = Object.keys(value).filter(key => {
      return !checkedKeys.includes(key);
    });

    if (uncheckedKeys.length > 0) {
      valid = false;
      let errorKey = Array.isArray(parameter) ? parameter.join('.') : parameter;
      errors[errorKey] = [
        options.errorCode ||
          `Object contained unchecked keys "${uncheckedKeys.join(', ')}"`
      ];
    }
  }

  let invalidKeys = Object.keys(options.keys).filter(key => {
    let keyOptions =
      typeof options.keys[key] === 'object' ? options.keys[key] : {};
    let keyType =
      typeof options.keys[key] === 'object'
        ? options.keys[key].type
        : options.keys[key];

    let validation = validate({
      type: keyType,
      parameter: Array.isArray(parameter)
        ? parameter.concat(key)
        : [parameter, key],
      value: value[key],
      actualValues,
      options: keyOptions
    });
    if (validation.errors && validation.errors.length > 0) {
      let errorKey = Array.isArray(parameter)
        ? parameter.concat(key).join('.')
        : `${parameter}.${key}`;
      errors[errorKey] = validation.errors;
    }
    parsed[key] = validation.parsed ? validation.parsed : value[key];
    return !validation.valid;
  });

  let errorKey = Array.isArray(parameter) ? parameter.join('.') : parameter;
  if (
    invalidKeys.length > 0 ||
    (errors[errorKey] && errors[errorKey].length > 0)
  ) {
    valid = false;

    return {
      valid,
      errors: [errors]
    };
  } else {
    return { valid, parsed };
  }
};

function objectTypeCheck(parameter, value, options) {
  if (Array.isArray(value)) {
    return error();
  }
  parameter = Array.isArray(parameter) ? parameter.join('.') : parameter;

  if (!options.allowNull && util.isNull(value)) {
    return {
      valid: false,
      errors: [
        options.nullCode ||
          options.errorCode ||
          `Expected parameter ${parameter} to be an object but it was ${JSON.stringify(
            value
          )}`
      ]
    };
  }

  if (typeof value !== 'object') {
    return error();
  }

  return { valid: true, errors: [] };

  function error() {
    return {
      valid: false,
      errors: [
        options.errorCode ||
          `Expected parameter ${parameter} to be an object but it was ${JSON.stringify(
            value
          )}`
      ]
    };
  }
}
