const arrayValidation = require('./array');
const booleanValidation = require('./boolean');
const emailValidation = require('./email');
const numberValidation = require('./number');
const objectValidation = require('./object');
const phoneValidation = require('./phone');
const stringValidation = require('./string');
const dateValidation = require('./date');
const identityNumberValidation = require('./identityNumber');
const util = require('../util');
const matchers = require('../matchers');

module.exports = {
  validate
};

function validate({
  type,
  parameter,
  value,
  options,
  actualValues = {},
  chain = Array.isArray(parameter) ? parameter : [parameter],
  expected = {}
}) {
  let requiredIf = options.requiredIf || false;
  let allowNull =  options.allowNull || false;
  chain = chain || parameter;

  if (requiredIf && util.isNull(value)) {
    let requiredFieldValue = util.getDeep(requiredIf, actualValues);
    let requiredFieldOptions = util.getDeepOptions(requiredIf, expected);
    let requiredFieldType = typeof requiredFieldOptions === 'string' ? requiredFieldOptions : requiredFieldOptions.type;

    if (requiredFieldType === 'boolean' && requiredFieldOptions.parse) {
      requiredFieldValue = JSON.parse(requiredFieldValue);
    }

    if (util.isNull(requiredFieldValue) || (requiredFieldType === 'boolean' && !requiredFieldValue)) {
      return {
        errors: [],
        valid: true
      };
    }
  }

  if ((allowNull || options.allowNull) && util.isNull(util.getDeep(chain, actualValues))) {
    return {
      errors: [],
      valid: true
    };
  }
  let validation;
  switch (type) {
    case 'phone': {
      validation = phoneValidation({parameter, value, options});
      break;
    } case 'email': {
      validation = emailValidation({parameter, value, options});
      break;
    } case 'number': {
      validation = numberValidation({parameter, value, options});
      break;
    } case 'object': {
      validation = objectValidation({parameter, value, actualValues, options, validate});
      break;
    } case 'date': {
      validation = dateValidation({parameter, value, options});
      break;
    } case 'string': {
      validation = stringValidation({parameter, value, options});
      break;
    } case 'array': {
      validation = arrayValidation({parameter, value, actualValues, options, validate});
      break;
    } case 'boolean': {
      validation = booleanValidation({parameter, value, options});
      break;
    } case 'identityNumber': {
      validation = identityNumberValidation({parameter, value, options});
      break;
    } default: {
      throw new Error(`${parameter} could not be validated against type "${type}": it has not been defined`);
      return;
    }
  }

  return applyMatchers(validation, actualValues, parameter, value, options, expected);
};

function applyMatchers(validation, actualValues, parameter, value, options, expected) {
  let matches = matchers.match(parameter, value, actualValues, options, expected);
  if (!matches.valid) {
    let matchErrors = util.mergeErrors(parameter, {}, matches.errors);
    validation.valid = false;
    validation.errors = validation.errors.concat(matchErrors);
  }

  return validation;
}