module.exports = ({ parameter, value, actualValues, options, validate }) => {
  if (typeof value !== 'object' || Array.isArray(value)) {
    return { valid: false };
  }

  if (!options.keys) {
    return { valid: true };
  }

  const parsed = {};
  const error = {};
  if (options.strictKeyCheck) {
    const checkedKeys = Object.keys(options.keys);
    const uncheckedKeys = Object.keys(value).filter(
      key => !checkedKeys.includes(key)
    );

    if (uncheckedKeys.length) {
      return {
        valid: false,
        error:
          options.errorCode ||
          `Object contained unchecked keys ${JSON.stringify(
            uncheckedKeys.join(', ')
          )}`
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

    if (validation.valid) {
      parsed[key] = validation.hasOwnProperty('parsed')
        ? validation.parsed
        : value[key];
    } else {
      error[key] = validation.error;
    }

    return !validation.valid;
  });

  return invalidKeys.length ? { valid: false, error } : { valid: true, parsed };
};
