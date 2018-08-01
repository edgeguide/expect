const isEqualTo = require('./isEqualTo');
const { getDeep, getDeepOptions } = require('./getDeep');
const { parseType, parseFunctionWrapper } = require('./parse');

module.exports = {
  formatParameter,
  isEqualTo,
  getDeep,
  getDeepOptions,
  parseType,
  parseFunctionWrapper,
  isNull,
  sanitize,
  containsUnsafe
};

function formatParameter(parameter) {
  return Array.isArray(parameter) ? parameter.join('.') : parameter;
}

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
