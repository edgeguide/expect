function itemsFunctionWrapper(itemsFunction, item) {
  try {
    return itemsFunction(item);
  } catch (error) {
    return item;
  }
}

module.exports = ({ parameter, value, actualValues, options, validate }) => {
  const { convert, items, errorCode } = options;

  if (convert && !Array.isArray(value)) {
    value = value === undefined ? [] : [value];
  }

  if (!Array.isArray(value)) {
    return {
      valid: false,
      errors: [
        errorCode ||
          `Expected parameter ${parameter} to be of type array but it was ${JSON.stringify(
            value
          )}`
      ]
    };
  }

  if (!items) {
    return { valid: true, parsed: value };
  }

  const errors = {};
  const parsed = [];
  const hasInvalidItems = value.filter((item, index) => {
    const itemOptions =
      typeof items === 'function'
        ? itemsFunctionWrapper(items, item)
        : typeof items === 'object'
          ? items
          : {};

    const itemType =
      typeof items === 'string'
        ? items
        : typeof itemOptions === 'object'
          ? itemOptions.type
          : itemOptions;

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
      errors[index] = validation.errors;
    }
    parsed.push(validation.parsed ? validation.parsed : item);
    return !validation.valid;
  });

  return hasInvalidItems.length
    ? { valid: false, errors }
    : { valid: true, parsed };
};
