function itemsFunctionWrapper(itemsFunction, item) {
  try {
    return itemsFunction(item);
  } catch (error) {
    return item;
  }
}

module.exports = ({ parameter, value, actualValues, options, validate }) => {
  const { convert, items } = options;

  if (convert && !Array.isArray(value)) {
    value = value === undefined ? [] : [value];
  }

  if (!Array.isArray(value)) {
    return { valid: false };
  }

  if (!items) {
    return { valid: true, parsed: value };
  }

  const error = {};
  const parsed = [];
  const hasInvalidItems = value.filter((item, index) => {
    const itemOptions =
      typeof items === 'function'
        ? itemsFunctionWrapper(items, item)
        : typeof items === 'object' && items !== null
          ? items
          : {};

    const itemType =
      typeof items === 'string'
        ? items
        : typeof itemOptions === 'object' && itemOptions !== null
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

    if (validation.valid) {
      parsed.push(
        validation.hasOwnProperty('parsed') ? validation.parsed : item
      );
    } else {
      error[index] = validation.error;
    }

    return !validation.valid;
  });

  return hasInvalidItems.length
    ? { valid: false, error }
    : { valid: true, parsed };
};
