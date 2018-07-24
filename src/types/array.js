module.exports = ({ parameter, value, actualValues, options, validate }) => {
  if (options.convert && !Array.isArray(value)) {
    value = [value];
  }

  if (options.items) {
    const itemOptions = typeof options.items === 'object' ? options.items : {};
    const itemType =
      typeof options.items === 'object' ? options.items.type : options.items;
    const errors = {};
    const parsed = [];
    const hasInvalidItems = value.filter((item, index) => {
      const validation = validate({
        type: itemType,
        parameter: Array.isArray(parameter)
          ? parameter.concat(index)
          : [parameter, index],
        value: item,
        options: itemOptions,
        actualValues
      });

      if (validation.errors) {
        const errorKey = Array.isArray(parameter)
          ? parameter.concat(index).join('.')
          : `${parameter}.${index}`;
        errors[errorKey] = validation.errors;
      }
      parsed.push(validation.parsed ? validation.parsed : item);
      return !validation.valid;
    });

    return hasInvalidItems.length
      ? { valid: false, errors: [errors] }
      : { valid: true, parsed };
  }

  return Array.isArray(value)
    ? { valid: true, parsed: value, errors: [] }
    : {
      valid: false,
      errors: [
        options.errorCode ||
            `Expected parameter ${parameter} to be of type array but it was ${JSON.stringify(
              value
            )}`
      ]
    };
};
