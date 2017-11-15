module.exports = {
  isNull,
  getErrors,
  mergeErrors,
  getDeep,
  parseType
};

function isNull(value) {
  if (value === undefined) {
    return true;
  }

  if (value === null) {
    return true;
  }

  if (value === '') {
    return true;
  }

  return false;
}

function getErrors(chain, errors) {
  if (!Array.isArray(chain) || chain.length === 0) {
    return;
  }

  let errorPart = errors[chain[0]];

  for (var i = 0; i < chain.length; i++) {
    if (!errorPart) {
      return;
    }
    let parameter = chain[i];
    errorPart = errorsPart[parameter];
  }

  return errorPart;
}


function mergeErrors(parameter, allErrors, newErrors) {
  parameter = Array.isArray(parameter) ? parameter.join('.') : parameter;

  if (!Array.isArray(newErrors)) {
    return allErrors;
  }

  newErrors.forEach(error => {
    if (typeof error === 'object') {
      Object.keys(error).forEach(key => {
        return mergeErrors(key, allErrors, error[key]);
      });
    } else {
      allErrors[parameter] = Array.isArray(allErrors[parameter]) ? allErrors[parameter].concat(error) : [error];
    }
  });

  return allErrors;
}

function getDeep(chain, values) {
  debugger;
  if (values === undefined) {
    return undefined;
  }

  if (values.hasOwnProperty(chain)) {
    return values[chain];
  }

  if (!Array.isArray(chain)) {
    return undefined;
  }

  let key = chain[0];
  return getDeep(chain.slice(1), values[key]);
}

function parseType(type, value) {
  try {
    switch (type) {
      case 'array': {
        return JSON.parse(value);
      }
      case 'boolean': {
        return JSON.parse(value);
      }
      case 'date': {
        return new Date(value);
      }
      case 'number': {
        value = value.replace(/\s/, '');
        return parseFloat(value);
      }
      case 'string': {
        return JSON.stringify(value);
      }
    }
  } catch (error) {
    return value;
  }
}