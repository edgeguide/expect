import { IErrorObject, Options, OptionsValue, Errors } from "./definitions";
import { validate, ExpectTypes } from "./types/index";

export = function expect<
  Schema extends Record<string, Options | ExpectTypes> | Record<string, any>
>(
  schema: Schema,
  input: unknown
): {
  errors(): { [K in keyof Schema]?: Errors<Schema[K]> };
  getParsed(): { [K in keyof Schema]?: OptionsValue<Schema[K]> };
  wereMet(): boolean;
} {
  if (!isObject(schema)) {
    throw new Error("Invalid validation schema");
  }

  const parsedValues: Record<string, any> = {};
  const errors: IErrorObject = {};
  let valid = true;

  Object.keys(schema).forEach((parameter) => {
    if (!isObject(input)) {
      valid = false;
      errors[parameter] = "Invalid input";
      return;
    }

    const options = schema[parameter];
    const value = input[parameter];

    const validation = validate({
      input,
      value,
      schema,
      options,
      parameter,
      visitedParams: [],
      type: typeof options === "string" ? options : options.type,
    });

    if (!validation.valid) {
      valid = false;
      if (validation.error) errors[parameter] = validation.error;
      return;
    }

    if (validation.parsed !== undefined) {
      parsedValues[parameter] = validation.parsed;
    }
  });

  return {
    errors: () => errors as any,
    getParsed: () => parsedValues as any,
    wereMet: () => valid,
  };
};

function isObject(val: unknown): val is Record<string, unknown> {
  return val !== null && typeof val === "object";
}
