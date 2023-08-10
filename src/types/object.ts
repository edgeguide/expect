import { IErrorObject, IObjectOption, ValidateFunction } from "../definitions";
import isRecord from "../util/isRecord";
import { formatParameter } from "../util/index";
import { isUnsafe } from "../util/validation";

export function validateObject({
  parameter,
  value,
  options,
  input,
  schema,
  visitedParams = [],
  validate,
}: {
  parameter: string | number | Array<string | number>;
  value: unknown;
  options: IObjectOption;
  input?: unknown;
  schema: Record<string, any>;
  visitedParams: Array<string | number>;
  validate: ValidateFunction;
}) {
  if (!isRecord(value) || Array.isArray(value)) return { valid: false };

  const { errorCode, keys, strictKeyCheck } = options;

  if (Object.keys(value).some((key) => isUnsafe(key))) {
    return {
      valid: false,
      error: errorCode || `Object contained unsafe prototype keys`,
    };
  }

  if (!keys) return { valid: true };

  const validKeys = Object.keys(keys).filter((key) => keys[key] != null);

  const parsed: Record<string, any> = Object.create(null);
  const error: IErrorObject = Object.create(null);
  if (strictKeyCheck) {
    const uncheckedKeys = Object.keys(value).filter(
      (key) => !validKeys.includes(key)
    );

    if (uncheckedKeys.length) {
      return {
        valid: false,
        error:
          errorCode ||
          `Object contained unchecked keys ${JSON.stringify(
            uncheckedKeys.join(", ")
          )}`,
      };
    }
  }

  const invalidKeys = validKeys.filter((key) => {
    const option = keys[key];

    const keyType =
      typeof option === "object" && option !== null ? option.type : option;

    if (!keyType) return true;

    const keyOptions =
      typeof option === "object" && option !== null
        ? option
        : { type: keyType };

    const validation = validate({
      type: keyType,
      parameter: Array.isArray(parameter)
        ? parameter.concat(key)
        : [parameter, key],
      value: value[key],
      options: keyOptions,
      input,
      schema,
      visitedParams: visitedParams.concat(formatParameter(parameter)),
    });

    if (!validation.valid) error[key] = validation.error;
    else {
      const parsedValue =
        "parsed" in validation ? validation.parsed : value[key];
      if (parsedValue !== undefined) parsed[key] = parsedValue;
    }

    return !validation.valid;
  });

  return invalidKeys.length ? { valid: false, error } : { valid: true, parsed };
}
