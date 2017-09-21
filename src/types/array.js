const util = require('../util');

module.exports = (parameter, actual, options, validate) => {
  if (options.items) {
    let validation = arrayTypeCheck(parameter, actual, options);
    if (!validation.valid) {
      return validation;
    }
    let itemOptions = typeof options.items === 'object' ? options.items : {};
    let itemType = typeof options.items === 'object' ? options.items.type : options.items;

    let parsed = [];
    let containsInvalidChild = actual.some(item => {
      let validation = validate(itemType, parameter, item, itemOptions);
      parsed.push(validation.parsed ? validation.parsed : item);
      return !validation.valid;
    });
    if (containsInvalidChild) {
      let errorCode = itemOptions.errorCode || `Parameter ${parameter} contained items which were not of type ${itemType}`;
      return {
        valid: false,
        error: [errorCode]
      };
    } else {
      return {valid: true, parsed: parsed};
    }
  } else {
    return arrayTypeCheck(parameter, actual, options);
  }
}

function arrayTypeCheck(parameter, actual, options) {
  let result = checkValue();
  if (result.valid) {
    return result;
  }

  if (options.parse) {
    actual = JSON.parse(actual);
    return Object.assign({}, checkValue(actual), {
      parsed: actual
    });
  } else {
    return result;
  }

  function checkValue() {
    if (!options.allowNull && util.isNull(actual)) {
      let errorCode = options.nullCode || options.errorCode;
      errorCode = errorCode ||  `Expected parameter ${parameter} to be an array but it was ${JSON.stringify(actual)}`;
      return {
        error: [errorCode],
        valid: false
      };
    }

    if (!Array.isArray(actual)) {
      return {
        error: [options.errorCode === undefined ? `Expected parameter ${parameter} to be an array but it was ${JSON.stringify(actual)}` : options.errorCode],
        valid: false
      };
    }

    if (options.strict && actual.length === 0) {
      return {
        error: [options.emptyErrorCode === undefined ? `Empty arrays are not allowed in strict mode (${parameter} was ${JSON.stringify(actual)})` : options.emptyErrorCode],
        valid: false
      };
    }

    return { valid: true, parsed: actual };
  }
}
