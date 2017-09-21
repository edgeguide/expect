const arrayValidation = require('./array');
const booleanValidation = require('./boolean');
const emailValidation = require('./email');
const numberValidation = require('./number');
const objectValidation = require('./object');
const phoneValidation = require('./phone');
const stringValidation = require('./string');
const dateValidation = require('./date');
const identityNumberValidation = require('./identityNumber');

module.exports = {
  validate
};

function validate(type, parameter, value, parameterOptions) {
  switch (type) {
    case 'phone':
      return phoneValidation(parameter, value, parameterOptions);
    case 'email':
      return emailValidation(parameter, value, parameterOptions);
    case 'number':
      return numberValidation(parameter, value, parameterOptions);
    case 'object':
      return objectValidation(parameter, value, parameterOptions);
    case 'date':
      return dateValidation(parameter, value, parameterOptions);
    case 'string':
      return stringValidation(parameter, value, parameterOptions);
    case 'array':
      return arrayValidation(parameter, value, parameterOptions, validate);
    case 'boolean':
      return booleanValidation(parameter, value, parameterOptions);
    case 'identityNumber':
      return identityNumberValidation(parameter, value, parameterOptions);
    default:
      throw new Error(`${parameter} could not be validated against type "${type}": it has not been defined`);
      return;
  }
};
