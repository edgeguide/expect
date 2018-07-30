const {
  isEqualTo,
  isNull,
  getDeep,
  getDeepOptions,
  parseType,
  parseFunctionWrapper
} = require('../util');

const mapTypeValidations = {
  array: require('./array'),
  boolean: require('./boolean'),
  email: require('./email'),
  number: require('./number'),
  object: require('./object'),
  phone: require('./phone'),
  string: require('./string'),
  date: require('./date'),
  identityNumber: require('./identityNumber')
};

module.exports = function validate({
  type,
  parameter,
  value,
  options,
  actualValues = {},
  expected = {}
}) {
  const {
    parse,
    equalTo,
    requiredIf,
    allowNull,
    condition,
    errorCode,
    nullCode,
    conditionErrorCode,
    equalToErrorCode
  } = options;
  const validation = { valid: true };
  const initialValue = value;

  if (parse) {
    value =
      typeof parse === 'function'
        ? parseFunctionWrapper({ value, parse })
        : parseType({ value, type });
    validation.parsed = value;
  }

  if (mapTypeValidations[type]) {
    Object.assign(
      validation,
      mapTypeValidations[type]({
        parameter,
        value,
        actualValues,
        options,
        validate
      })
    );
  } else if (type !== 'any') {
    return {
      valid: false,
      errors: [
        `${parameter} could not be validated against type "${type}": it has not been defined`
      ]
    };
  }

  if (requiredIf && isNull(initialValue)) {
    let requiredFieldValue = getDeep(requiredIf, actualValues);
    const requiredFieldOptions = getDeepOptions(requiredIf, expected);
    const requiredFieldType =
      typeof requiredFieldOptions === 'string'
        ? requiredFieldOptions
        : requiredFieldOptions && requiredFieldOptions.type;

    if (
      requiredFieldType === 'boolean' &&
      requiredFieldOptions &&
      requiredFieldOptions.parse
    ) {
      requiredFieldValue =
        typeof requiredFieldOptions.parse === 'function'
          ? parseFunctionWrapper({ value, parse: requiredFieldOptions.parse })
          : parseType({ value: requiredFieldValue, type: requiredFieldType });
    }

    if (
      isNull(requiredFieldValue) ||
      (requiredFieldType === 'boolean' && !requiredFieldValue)
    ) {
      return { valid: true };
    }
  }

  if (!allowNull && isNull(initialValue)) {
    return {
      valid: false,
      errors: [
        nullCode ||
          errorCode ||
          `Expected parameter ${
            Array.isArray(parameter) ? parameter.join('.') : parameter
          } to be of type ${type} but it was ${JSON.stringify(value)}`
      ]
    };
  }

  if (typeof condition === 'function') {
    let valid;
    try {
      valid = condition(value);
    } catch (error) {}

    if (!valid) {
      validation.valid = false;
      validation.errors = [
        conditionErrorCode ||
          errorCode ||
          `Expected parameter ${JSON.stringify(value)} to meet condition`
      ];
    }
  }

  if (allowNull && isNull(initialValue)) {
    validation.valid = true;
    validation.errors = [];
  }

  if (equalTo && !isEqualTo({ value, type, equalTo, actualValues, expected })) {
    validation.valid = false;
    validation.errors = (validation.errors || []).concat(
      equalToErrorCode ||
        `Expected parameter ${JSON.stringify(
          Array.isArray(parameter) ? parameter.join('.') : parameter
        )} to be equal to ${JSON.stringify(equalTo)}.`
    );
  }

  return validation;
};
