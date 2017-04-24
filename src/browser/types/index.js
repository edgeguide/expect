'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
      if (parameterOptions.items) {
        var validation = arrayValidation(parameter, value, parameterOptions);
        if (!validation.valid) {
          return validation;
        }

        var itemOptions = _typeof(parameterOptions.items) === 'object' ? parameterOptions.items : {};
        var itemType = _typeof(parameterOptions.items) === 'object' ? parameterOptions.items.type : parameterOptions.items;

        var containsInvalidChild = value.some(function (item) {
          var validation = validate(itemType, parameter, item, itemOptions);
          return !validation.valid;
        });

        if (containsInvalidChild) {
          var errorCode = itemOptions.errorCode || 'Parameter ' + parameter + ' contained items which were not of type ' + itemType;
          return {
            valid: false,
            error: [errorCode]
          };
        } else {
          return { valid: true };
        }
      } else {
        return arrayValidation(parameter, value, parameterOptions);
      }
    case 'boolean':
      return booleanValidation(parameter, value, parameterOptions);
    case 'identityNumber':
      return identityNumberValidation(parameter, value, parameterOptions);
    default:
      throw new Error(parameter + ' could not be validated against type "' + type + '": it has not been defined');
      return;
  }
};