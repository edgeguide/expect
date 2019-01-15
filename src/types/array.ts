import {
  Options,
  ExpectedType,
  ValidateFunction,
  IArrayOption,
  IErrorObject
} from '../definitions';

export function validateArray({
  parameter,
  value,
  actualValues,
  options,
  validate
}: {
  parameter: Array<string | number> | string | number;
  value: any;
  actualValues: any;
  options: IArrayOption;
  validate: ValidateFunction;
}) {
  const { convert, items } = options;

  if (convert && !Array.isArray(value)) {
    value = value === undefined ? [] : [value];
  }

  if (!Array.isArray(value)) {
    return { valid: false };
  }

  if (!items) {
    return { valid: true, parsed: value };
  }

  const error: IErrorObject = {};
  const parsed: any[] = [];
  const hasInvalidItems = value.filter((item, index) => {
    let itemOptions = items;
    if (typeof items === 'function') {
      try {
        itemOptions = items(item);
      } catch (error) {
        return { valid: false, error };
      }
    }

    if (
      itemOptions === null ||
      (typeof itemOptions !== 'string' && typeof itemOptions !== 'object')
    ) {
      return { valid: false, error: 'Invalid items' };
    }

    const validation = validate({
      type: typeof itemOptions === 'string' ? itemOptions : itemOptions.type,
      parameter: Array.isArray(parameter)
        ? parameter.concat(index)
        : [parameter, index],
      value: item,
      options: itemOptions,
      actualValues
    });

    if (validation.valid) {
      parsed.push(
        validation.hasOwnProperty('parsed') ? validation.parsed : item
      );
    } else {
      error[index] = validation.error;
    }

    return !validation.valid;
  });

  return hasInvalidItems.length
    ? { valid: false, error }
    : { valid: true, parsed };
}
