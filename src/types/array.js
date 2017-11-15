const util = require('../util');

module.exports = ({parameter, value, actualValues, options, validate}) => {
  if (options.items) {
    let validation = arrayTypeCheck(parameter, value, options);
    if (!validation.valid) {
      return validation;
    }
    let itemOptions = typeof options.items === 'object' ? options.items : {};
    let itemType = typeof options.items === 'object' ? options.items.type : options.items;
    let errors = {};
    let parsed = [];
    debugger;
    let hasInvalidItems = value.filter((item, index) => {
      let validation = validate({
        type: itemType,
        parameter: Array.isArray(parameter) ? parameter.concat(index) : [parameter, index],
        value: item,
        options: itemOptions,
        actualValues
      });
      if (validation.errors) {
        let errorKey = Array.isArray(parameter) ? parameter.concat(index).join('.') : `${parameter}.${index}`;
        errors[errorKey] = validation.errors;
      }
      parsed.push(validation.parsed ? validation.parsed : item);
      return !validation.valid;
    });
    if (hasInvalidItems.length > 0) {
      return {
        valid: false,
        errors: [errors]
      };
    } else {
      return {valid: true, parsed: parsed};
    }
  }

  return arrayTypeCheck(parameter, value, options);
}

function arrayTypeCheck(parameter, value, options) {
  parameter = Array.isArray(parameter) ? parameter.join('.') : parameter;

  let result = checkValue();
  if (result.valid) {
    return result;
  }

  if (options.parse) {
    value = util.parseType('array', value);
    return Object.assign({}, checkValue(value), {
      parsed: value
    });
  } else {
    return result;
  }

  function checkValue() {
    if (!options.allowNull && util.isNull(value)) {
      let errorCode = options.nullCode || options.errorCode;
      errorCode = errorCode ||  `Expected parameter ${parameter} to be an array but it was ${JSON.stringify(value)}`;
      return {
        errors: [errorCode],
        valid: false
      };
    }

    if (!Array.isArray(value)) {
      return {
        errors: [options.errorCode === undefined ? `Expected parameter ${parameter} to be an array but it was ${JSON.stringify(value)}` : options.errorCode],
        valid: false
      };
    }

    if (options.strict && value.length === 0) {
      return {
        errors: [options.emptyErrorCode === undefined ? `Empty arrays are not allowed in strict mode (${parameter} was ${JSON.stringify(value)})` : options.emptyErrorCode],
        valid: false
      };
    }

    return { valid: true, parsed: value, errors: []};
  }
}
