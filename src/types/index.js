const {
  formatParameter,
  isEqualTo,
  isNull,
  getDeep,
  parseType,
  parseFunctionWrapper
} = require('../util');

const mapTypeValidations = {
  any: require('./any'),
  number: require('./number'),
  boolean: require('./boolean'),
  string: require('./string'),
  array: require('./array'),
  object: require('./object'),
  date: require('./date'),
  phone: require('./phone'),
  email: require('./email'),
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
    allowNullErrorCode,
    conditionErrorCode,
    equalToErrorCode
  } = options;

  if (typeof type !== 'string' || !mapTypeValidations[type]) {
    throw new Error(
      `Invalid type ${JSON.stringify(type)} for parameter ${formatParameter(
        parameter
      )}`
    );
  }

  const initialValue = value;
  if (parse) {
    value =
      typeof parse === 'function'
        ? parseFunctionWrapper({ value, parse })
        : parseType({ value, type });
  }

  const validation = mapTypeValidations[type]({
    parameter,
    value,
    actualValues,
    options,
    validate
  });

  const validNullValue =
    isNull(value) ||
    (isNull(initialValue) &&
      mapTypeValidations[type]({
        parameter,
        value: validation.hasOwnProperty('parsed') ? validation.parsed : value,
        actualValues,
        options,
        validate
      }).valid);

  const isAllowNull =
    typeof allowNull === 'function' ? allowNullWrapper(allowNull) : allowNull;
  const notRequired = requiredIf && isNull(getDeep(requiredIf, actualValues));
  const nullAllowed = isAllowNull || notRequired;

  if (validNullValue && !nullAllowed) {
    return {
      valid: false,
      error:
        allowNullErrorCode ||
        errorCode ||
        `Expected parameter ${formatParameter(
          parameter
        )} to be of type ${type} but it was ${JSON.stringify(value)}`
    };
  }

  if (!validation.valid && (!validNullValue || !nullAllowed)) {
    return {
      valid: false,
      error:
        validation.error ||
        errorCode ||
        `Expected parameter ${formatParameter(
          parameter
        )} to be of type ${type} but it was ${JSON.stringify(value)}`
    };
  }

  if (equalTo && !isEqualTo({ value, type, equalTo, actualValues, expected })) {
    return {
      valid: false,
      error:
        equalToErrorCode ||
        errorCode ||
        `Expected parameter ${formatParameter(
          parameter
        )} to be equal to ${JSON.stringify(equalTo)}.`
    };
  }

  if (
    nullAllowed &&
    (isNull(value) ||
      (isNull(initialValue) &&
        mapTypeValidations[type]({
          parameter,
          value: validation.hasOwnProperty('parsed')
            ? validation.parsed
            : value,
          actualValues,
          options,
          validate
        }).valid))
  ) {
    return {
      valid: true,
      parsed: validation.hasOwnProperty('parsed') ? validation.parsed : value
    };
  }

  if (typeof condition === 'function') {
    let valid = false;
    try {
      valid = condition(value);
    } catch (error) {}

    if (!valid) {
      return {
        valid: false,
        error:
          conditionErrorCode ||
          errorCode ||
          `Expected parameter ${formatParameter(parameter)} to meet condition`
      };
    }
  }

  return {
    valid: true,
    parsed: validation.hasOwnProperty('parsed') ? validation.parsed : value
  };
};

function allowNullWrapper(allowNull) {
  try {
    return allowNull();
  } catch (error) {
    return false;
  }
}
