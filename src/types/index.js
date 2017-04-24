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
      if (parameterOptions.items) {
        let validation = arrayValidation(parameter, value, parameterOptions);
        if (!validation.valid) {
          return validation;
        }

        let itemOptions = typeof parameterOptions.items === 'object' ? parameterOptions.items : {};
        let itemType = typeof parameterOptions.items === 'object' ? parameterOptions.items.type : parameterOptions.items;

        let parsed = [];
        let containsInvalidChild = value.some(item => {
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
        return arrayValidation(parameter, value, parameterOptions);
      }
    case 'boolean':
      return booleanValidation(parameter, value, parameterOptions);
    case 'identityNumber':
      return identityNumberValidation(parameter, value, parameterOptions);
    default:
      throw new Error(`${parameter} could not be validated against type "${type}": it has not been defined`);
      return;
  }
};
