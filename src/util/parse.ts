export { parseType, parseFunctionWrapper };

function parseType({ value, type }: { value: any; type: string }) {
  try {
    switch (type) {
      case 'string': {
        return typeof value === 'string' ? value : JSON.stringify(value);
      }
      case 'number': {
        return typeof value === 'string' && value ? Number(value) : value;
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
        const result = JSON.parse(value);
        return result;
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

function parseFunctionWrapper({
  value,
  parse
}: {
  value: any;
  parse: (x: any) => any;
}) {
  try {
    return parse(value);
  } catch (error) {
    return value;
  }
}
