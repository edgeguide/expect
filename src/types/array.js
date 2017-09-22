const util = require('../util');

module.exports = (parameter, actual, options, validate) => {
  if (options.items) {
    let validation = arrayTypeCheck(parameter, actual, options);
    if (!validation.valid) {
      return validation;
    }
    let itemOptions = typeof options.items === 'object' ? options.items : {};
    let itemType = typeof options.items === 'object' ? options.items.type : options.items;
    let errors = {};
    let parsed = [];
    let hasInvalidItems = actual.filter((item, index) => {
      let validation = validate({
        type: itemType,
        parameter: `${parameter}.${index}`,
        value: item,
        parameterOptions: itemOptions,
        actualValues: actual
      });
      if (validation.errors) {
        errors[`${parameter}.${index}`] = validation.errors;
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

  return arrayTypeCheck(parameter, actual, options);
}

function arrayTypeCheck(parameter, actual, options) {
  let result = checkValue();
  if (result.valid) {
    return result;
  }

  if (options.parse) {
    actual = util.parseType('array', actual);
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
        errors: [errorCode],
        valid: false
      };
    }

    if (!Array.isArray(actual)) {
      return {
        errors: [options.errorCode === undefined ? `Expected parameter ${parameter} to be an array but it was ${JSON.stringify(actual)}` : options.errorCode],
        valid: false
      };
    }

    if (options.strict && actual.length === 0) {
      return {
        errors: [options.emptyErrorCode === undefined ? `Empty arrays are not allowed in strict mode (${parameter} was ${JSON.stringify(actual)})` : options.emptyErrorCode],
        valid: false
      };
    }

    return { valid: true, parsed: actual, errors: []};
  }
}
