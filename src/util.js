module.exports = {
  isNull,
  getErrors,
  mergeErrors,
  getDeep,
  getDeepOptions,
  parseType,
  containsUnsafe,
  sanitize
};

const htmlEntityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
  '!': '&excl;',
  '@': '&commat;',
  $: '&dollar;',
  '(': '&lpar;',
  ')': '&rpar;',
  '=': '&equals;',
  '+': '&plus;',
  '{': '&lbrace;',
  '}': '&rbrace;',
  '[': '&lbrack;',
  ']': '&rbrack;'
};

const nonStrictSubset = ['&', '<', '>', '"', "'"];

function containsUnsafe({ value, strict, allowed = [] }) {
  if (typeof value !== 'string') {
    throw new Error('Non-strings cannot be checked for unsafe values');
  }

  const characters = Array.from(value);

  return characters.some(character => {
    if (!strict && !nonStrictSubset.includes(character)) {
      return false;
    }
    if (allowed.includes(character)) {
      return false;
    }

    return htmlEntityMap[character] !== undefined;
  });
}

function sanitize({ value, strict, allowed = [] }) {
  if (typeof value !== 'string') {
    throw new Error('Non-strings cannot be sanitized');
  }

  let sanitizedValue = '';
  const characters = Array.from(value);

  characters.forEach(character => {
    if (!strict && !nonStrictSubset.includes(character)) {
      sanitizedValue += character;
      return;
    }
    if (allowed.includes(character)) {
      sanitizedValue += character;
      return;
    }
    const entity = htmlEntityMap[character];
    sanitizedValue += entity ? entity : character;
  });

  return sanitizedValue;
}

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
      allErrors[parameter] = Array.isArray(allErrors[parameter])
        ? allErrors[parameter].concat(error)
        : [error];
    }
  });

  return allErrors;
}

function getDeep(chain, values) {
  if (values === undefined) {
    return undefined;
  }

  if (Object.prototype.hasOwnProperty.call(values, chain)) {
    return values[chain];
  }

  if (!Array.isArray(chain)) {
    return undefined;
  }

  let key = chain[0];
  return getDeep(chain.slice(1), values[key]);
}

function getDeepOptions(chain, values) {
  if (values === undefined) {
    return undefined;
  }

  if (!Array.isArray(chain)) {
    return values[chain];
  }

  if (chain.length === 0) {
    return values;
  }

  let key = chain[0];
  let nextValues = values[key];
  if (Object.prototype.hasOwnProperty.call(values, 'items')) {
    nextValues = values.items[key];
  }
  if (Object.prototype.hasOwnProperty.call(values, 'keys')) {
    nextValues = values.keys[key];
  }
  return getDeepOptions(chain.slice(1), nextValues);
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
