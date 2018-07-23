const { parseType, parseFunctionWrapper, isNull } = require('../util');

module.exports = ({ parameter, value, actualValues, options, validate }) => {
  if (options.convert && !Array.isArray(value)) {
    value = [value];
  }
  if (options.items) {
    const validation = arrayTypeCheck(parameter, value, options);
    if (!validation.valid) {
      return validation;
    }
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
    if (hasInvalidItems.length) {
      return {
        valid: false,
        errors: [errors]
      };
    } else {
      return { valid: true, parsed };
    }
  }

  return arrayTypeCheck(parameter, value, options);
};

function arrayTypeCheck(parameter, value, options) {
  parameter = Array.isArray(parameter) ? parameter.join('.') : parameter;

  const result = checkValue();
  if (result.valid) {
    return result;
  }

  if (options.parse) {
    value =
      typeof options.parse === 'function'
        ? parseFunctionWrapper({ value, parse: options.parse })
        : parseType({ value, type: 'array' });
    return Object.assign({}, checkValue(value), {
      parsed: value
    });
  } else {
    return result;
  }

  function checkValue() {
    if (!options.allowNull && isNull(value)) {
      return {
        valid: false,
        errors: [
          options.nullCode ||
            options.errorCode ||
            `Expected parameter ${parameter} to be of type array but it was ${JSON.stringify(
              value
            )}`
        ]
      };
    }

    if (!Array.isArray(value)) {
      return {
        valid: false,
        errors: [
          options.errorCode ||
            `Expected parameter ${parameter} to be of type array but it was ${JSON.stringify(
              value
            )}`
        ]
      };
    }

    return { valid: true, parsed: value, errors: [] };
  }
}
