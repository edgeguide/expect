const arrayValidation = require('./array');
const booleanValidation = require('./boolean');
const emailValidation = require('./email');
const numberValidation = require('./number');
const objectValidation = require('./object');
const phoneValidation = require('./phone');
const stringValidation = require('./string');
const dateValidation = require('./date');
const identityNumberValidation = require('./identityNumber');
const {
  equalTo,
  isNull,
  getDeep,
  getDeepOptions,
  parseType,
  parseFunctionWrapper,
  mergeErrors
} = require('../util');

module.exports = { validate };

function validate({
  type,
  parameter,
  value,
  options,
  actualValues = {},
  expected = {}
}) {
  const { requiredIf, allowNull, condition, nullCode, errorCode } = options;

  let validation;
  switch (type) {
    case 'phone': {
      validation = phoneValidation({ parameter, value, options });
      break;
    }
    case 'email': {
      validation = emailValidation({ parameter, value, options });
      break;
    }
    case 'number': {
      validation = numberValidation({ parameter, value, options });
      break;
    }
    case 'object': {
      validation = objectValidation({
        parameter,
        value,
        actualValues,
        options,
        validate
      });
      break;
    }
    case 'date': {
      validation = dateValidation({ parameter, value, options });
      break;
    }
    case 'string': {
      validation = stringValidation({ parameter, value, options });
      break;
    }
    case 'array': {
      validation = arrayValidation({
        parameter,
        value,
        actualValues,
        options,
        validate
      });
      break;
    }
    case 'boolean': {
      validation = booleanValidation({ parameter, value, options });
      break;
    }
    case 'identityNumber': {
      validation = identityNumberValidation({ parameter, value, options });
      break;
    }
    default: {
      throw new Error(
        `${parameter} could not be validated against type "${type}": it has not been defined`
      );
    }
  }

  if (requiredIf && isNull(value)) {
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
      return { valid: true, errors: [] };
    }
  }

  if (!allowNull && isNull(value)) {
    validation = {
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
    let valid = false;
    try {
      valid = condition(value);
    } catch (error) {}

    if (!valid) {
      validation = {
        valid: false,
        errors: [
          errorCode ||
            `Expected parameter ${JSON.stringify(value)} to meet condition`
        ]
      };
    }
  }

  if (!validation.valid && allowNull && isNull(value)) {
    validation = { valid: true, errors: [] };
  }

  if (options.equalTo) {
    const matches = equalTo({
      value,
      actualValues,
      options,
      expected
    });

    if (!matches.valid) {
      validation.valid = false;
      validation.errors = validation.errors.concat(
        mergeErrors(parameter, {}, matches.errors)
      );
    }
  }

  return validation;
}
