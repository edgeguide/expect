import { IErrorObject, Options, OptionsValue } from "./definitions";
import { validate, ExpectTypes } from "./types";

export = function expect<
  Schema extends Record<string, Options | ExpectTypes> | Record<string, any>
>(
  schema: Schema,
  input: Record<string, unknown>
): {
  errors(): Record<string, any>;
  getParsed(): { [K in keyof Schema]?: OptionsValue<Schema[K]> };
  wereMet(): boolean;
} {
  if (schema === null || typeof schema !== "object") {
    throw new Error("Invalid validation schema");
  }

  const parsedValues: Record<string, any> = {};
  const errors: IErrorObject = {};
  let valid = true;

  Object.keys(schema).forEach((parameter) => {
    if (input === null || typeof input !== "object") {
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
    errors: () => errors,
    getParsed: () => parsedValues as any,
    wereMet: () => valid,
  };
};
