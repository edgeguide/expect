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

function validate({type, parameter, value, options, actualValues = {}, chain = [parameter], expected = {}}) {
  let requiredIf = options.requiredIf || false;
  let allowNull =  options.allowNull || false;
  chain = chain || parameter;

  if (requiredIf && util.isNull(value)) {
    let requiredFieldType = typeof expected[requiredIf] === 'string' ? expected[requiredIf] : expected[requiredIf].type;
    let requiredFieldValue = actualValues[requiredIf];

    if (requiredFieldType === 'boolean' && expected[requiredIf].parse) {
      requiredFieldValue = JSON.parse(requiredFieldValue);
    }

    if (util.isNull(actualValues[requiredIf]) || (requiredFieldType === 'boolean' && !requiredFieldValue)) {
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

  switch (type) {
    case 'phone': {
      let validation = phoneValidation({parameter, value, options});
      return applyMatchers(validation, actualValues, parameter, value, options, expected);
    } case 'email': {
      let validation = emailValidation({parameter, value, options});
      return applyMatchers(validation, actualValues, parameter, value, options, expected);
    } case 'number': {
      let validation = numberValidation({parameter, value, options});
      return applyMatchers(validation, actualValues, parameter, value, options, expected);
    } case 'object': {
      let validation = objectValidation({parameter, value, actualValues, options, validate});
      return applyMatchers(validation, actualValues, parameter, value, options, expected);
    } case 'date': {
      let validation = dateValidation({parameter, value, options});
      return applyMatchers(validation, actualValues, parameter, value, options, expected);
    } case 'string': {
      let validation = stringValidation({parameter, value, options});
      return applyMatchers(validation, actualValues, parameter, value, options, expected);
    } case 'array': {
      let validation = arrayValidation({parameter, value, actualValues, options, validate});
      return applyMatchers(validation, actualValues, parameter, value, options, expected);
    } case 'boolean': {
      let validation = booleanValidation({parameter, value, options});
      return applyMatchers(validation, actualValues, parameter, value, options, expected);
    } case 'identityNumber': {
      let validation = identityNumberValidation({parameter, value, options});
      return applyMatchers(validation, actualValues, parameter, value, options, expected);
    } default:
      throw new Error(`${parameter} could not be validated against type "${type}": it has not been defined`);
      return;
  }
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