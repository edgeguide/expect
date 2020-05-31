import { IArrayOption, IErrorObject, ValidateFunction } from "../definitions";
import { formatParameter } from "../util";

export function validateArray({
  parameter,
  value,
  options,
  actualValues,
  expected,
  visitedParams = [],
  validate,
}: {
  parameter: string | number | Array<string | number>;
  value: unknown;
  options: IArrayOption;
  actualValues?: unknown;
  expected: Record<string, any>;
  visitedParams: Array<string | number>;
  validate: ValidateFunction;
}) {
  const { convert, items } = options;

  if (convert && !Array.isArray(value)) {
    value = value === undefined ? [] : [value];
  }

  if (!Array.isArray(value)) return { valid: false };

  if (!items) return { valid: true, parsed: value };

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
      actualValues,
      expected,
      visitedParams: visitedParams.concat(formatParameter(parameter)),
    });

    if (!validation.valid) error[index] = validation.error;
    else {
      parsed.push("parsed" in validation ? validation.parsed : item);
    }

    return !validation.valid;
  });

  return hasInvalidItems.length
    ? { valid: false, error }
    : { valid: true, parsed };
}
