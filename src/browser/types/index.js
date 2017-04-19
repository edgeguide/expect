'use strict';

var arrayValidation = require('./array');
var booleanValidation = require('./boolean');
var emailValidation = require('./email');
var numberValidation = require('./number');
var objectValidation = require('./object');
var phoneValidation = require('./phone');
var stringValidation = require('./string');
var dateValidation = require('./date');
var identityNumberValidation = require('./identityNumber');

module.exports = {
  validate: validate
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
      return arrayValidation(parameter, value, parameterOptions);
    case 'boolean':
      return booleanValidation(parameter, value, parameterOptions);
    case 'identityNumber':
      return identityNumberValidation(parameter, value, parameterOptions);
    default:
      throw new Error(parameter + ' could not be validated against type "' + type + '": it has not been defined');
      return;
  }
};