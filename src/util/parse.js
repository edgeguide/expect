module.exports = { parseType, parseFunctionWrapper };

function parseType({ value, type }) {
  try {
    switch (type) {
      case 'string': {
        return typeof value === 'string' ? value : JSON.stringify(value);
      }
      case 'number': {
        return Number(value);
      }
      case 'boolean': {
        try {
          return value === 'undefined' || value === 'NaN'
            ? false
            : !!JSON.parse(value);
        } catch (error) {
          return !!value;
        }
      }
      case 'array':
      case 'object': {
        return JSON.parse(value);
      }
      case 'date': {
        return new Date(value);
      }
      default:
        return value;
    }
  } catch (error) {
    return value;
  }
}

function parseFunctionWrapper({ value, parse }) {
  try {
    return parse(value);
  } catch (error) {
    return value;
  }
}
