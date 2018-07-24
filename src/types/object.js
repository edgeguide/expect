module.exports = ({ parameter, value, actualValues, options, validate }) => {
  if (!options.keys) {
    return objectTypeCheck(parameter, value, options);
  }

  let valid = true;
  const validation = objectTypeCheck(parameter, value, options);
  if (!validation.valid) {
    return validation;
  }

  const parsed = {};
  const errors = {};

  if (options.strictKeyCheck) {
    const checkedKeys = Object.keys(options.keys);
    const uncheckedKeys = Object.keys(value).filter(key => {
      return !checkedKeys.includes(key);
    });

    if (uncheckedKeys.length) {
      valid = false;
      const errorKey = Array.isArray(parameter)
        ? parameter.join('.')
        : parameter;
      errors[errorKey] = [
        options.errorCode ||
          `Object contained unchecked keys "${uncheckedKeys.join(', ')}"`
      ];
    }
  }

  const invalidKeys = Object.keys(options.keys).filter(key => {
    const keyOptions =
      typeof options.keys[key] === 'object' ? options.keys[key] : {};
    const keyType =
      typeof options.keys[key] === 'object'
        ? options.keys[key].type
        : options.keys[key];

    const validation = validate({
      type: keyType,
      parameter: Array.isArray(parameter)
        ? parameter.concat(key)
        : [parameter, key],
      value: value[key],
      actualValues,
      options: keyOptions
    });
    if (validation.errors && validation.errors.length) {
      const errorKey = Array.isArray(parameter)
        ? parameter.concat(key).join('.')
        : `${parameter}.${key}`;
      errors[errorKey] = validation.errors;
    }
    parsed[key] = validation.parsed ? validation.parsed : value[key];
    return !validation.valid;
  });

  const errorKey = Array.isArray(parameter) ? parameter.join('.') : parameter;
  if (invalidKeys.length || (errors[errorKey] && errors[errorKey].length)) {
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
  return typeof value === 'object' && !Array.isArray(value)
    ? { valid: true, errors: [] }
    : {
      valid: false,
      errors: [
        options.errorCode ||
            `Expected parameter ${
              Array.isArray(parameter) ? parameter.join('.') : parameter
            } to be of type object but it was ${JSON.stringify(value)}`
      ]
    };
}
