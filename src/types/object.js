module.exports = ({ parameter, value, actualValues, options, validate }) => {
  if (typeof value !== 'object' || Array.isArray(value)) {
    return {
      valid: false,
      errors: [
        options.errorCode ||
          `Expected parameter ${
            Array.isArray(parameter) ? parameter.join('.') : parameter
          } to be of type object but it was ${JSON.stringify(value)}`
      ]
    };
  }

  if (!options.keys) {
    return { valid: true };
  }

  const parsed = {};
  const errors = {};
  if (options.strictKeyCheck) {
    const checkedKeys = Object.keys(options.keys);
    const uncheckedKeys = Object.keys(value).filter(
      key => !checkedKeys.includes(key)
    );

    if (uncheckedKeys.length) {
      return {
        valid: false,
        errors: [
          options.errorCode ||
            `Object contained unchecked keys "${uncheckedKeys.join(', ')}"`
        ]
      };
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

    if (validation.errors) {
      errors[key] = validation.errors;
    }

    parsed[key] = validation.parsed ? validation.parsed : value[key];
    return !validation.valid;
  });

  return invalidKeys.length
    ? { valid: false, errors }
    : { valid: true, parsed };
};
