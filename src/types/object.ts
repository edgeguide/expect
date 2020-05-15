import { IErrorObject, IObjectOption, ValidateFunction } from "../definitions";

export function validateObject({
  parameter,
  value,
  actualValues,
  options,
  validate
}: {
  parameter: Array<string | number> | string | number;
  value: { [key: string]: any };
  actualValues: object;
  options: IObjectOption;
  validate: ValidateFunction;
}) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return { valid: false };
  }

  if (Object.prototype.hasOwnProperty.call(value, "__proto__")) {
    return { valid: false, error: 'Object contained unsafe keys "__proto__"' };
  }

  if (!options.keys) {
    return { valid: true };
  }

  const parsed: { [key: string]: any } = {};
  const error: IErrorObject = {};
  if (options.strictKeyCheck) {
    const checkedKeys = Object.keys(options.keys);
    const uncheckedKeys = Object.keys(value).filter(
      key => !checkedKeys.includes(key)
    );

    if (uncheckedKeys.length) {
      return {
        valid: false,
        error:
          options.errorCode ||
          `Object contained unchecked keys ${JSON.stringify(
            uncheckedKeys.join(", ")
          )}`
      };
    }
  }

  const optionsKeys = options.keys || {};
  const invalidKeys = Object.keys(optionsKeys).filter(key => {
    const option = optionsKeys[key];

    const keyType =
      typeof option === "object" && option !== null ? option.type : option;

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
      actualValues,
      options: keyOptions
    });

    if (validation.valid) {
      const parsedValue = Object.prototype.hasOwnProperty.call(
        validation,
        "parsed"
      )
        ? validation.parsed
        : value[key];
      if (parsedValue !== undefined) {
        parsed[key] = parsedValue;
      }
    } else {
      error[key] = validation.error;
    }

    return !validation.valid;
  });

  return invalidKeys.length ? { valid: false, error } : { valid: true, parsed };
}
