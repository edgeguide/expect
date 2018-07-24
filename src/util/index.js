const isEqualTo = require('./isEqualTo');
const { getDeep, getDeepOptions } = require('./getDeep');
const { parseType, parseFunctionWrapper } = require('./parse');

module.exports = {
  isEqualTo,
  getDeep,
  getDeepOptions,
  parseType,
  parseFunctionWrapper,
  isNull,
  sanitize,
  mergeErrors,
  containsUnsafe
};

const htmlEntityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&apos;',
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

const nonStrictSubset = ['&', '<', '>', '"', '\''];

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
    if (
      (!strict && !nonStrictSubset.includes(character)) ||
      allowed.includes(character)
    ) {
      sanitizedValue += character;
      return;
    }
    const entity = htmlEntityMap[character];
    sanitizedValue += entity ? entity : character;
  });

  return sanitizedValue;
}

function isNull(value) {
  return value === undefined || value === null || value === '';
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
