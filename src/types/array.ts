import { IArrayOption, IErrorObject, ValidateFunction } from "../definitions";

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
    if (typeof items === "function") {
      try {
        itemOptions = items(item);
      } catch (itemsError) {
        return { valid: false, error: itemsError };
      }
    }

    if (
      itemOptions === null ||
      (typeof itemOptions !== "string" && typeof itemOptions !== "object")
    ) {
      return { valid: false, error: "Invalid items" };
    }

    const validation = validate({
      type: typeof itemOptions === "string" ? itemOptions : itemOptions.type,
      parameter: Array.isArray(parameter)
        ? parameter.concat(index)
        : [parameter, index],
      value: item,
      options: itemOptions,
      actualValues
    });

    if (validation.valid) {
      parsed.push(
        Object.prototype.hasOwnProperty.call(validation, "parsed")
          ? validation.parsed
          : item
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
