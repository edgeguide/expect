import { IErrorObject, Options, OptionsValue } from "./definitions";
import { validate, ExpectTypes } from "./types";

export = function expect<
  Schema extends Record<string, Options | ExpectTypes> | Record<string, any>
>(
  expected: Schema,
  actualValues: Record<string, unknown>
): {
  errors(): Record<string, any>;
  getParsed(): { [K in keyof Schema]?: OptionsValue<Schema[K]> };
  wereMet(): boolean;
} {
  if (expected === null || typeof expected !== "object") {
    throw new Error("Invalid validation schema");
  }

  const parsedValues: Record<string, any> = {};
  const errors: IErrorObject = {};
  let valid = true;

  Object.keys(expected).forEach((parameter) => {
    if (actualValues === null || typeof actualValues !== "object") {
      valid = false;
      errors[parameter] = "Invalid input";
      return;
    }

    const options = expected[parameter];
    const actual = actualValues[parameter];

    const validation = validate({
      actualValues,
      expected,
      options,
      parameter,
      type: typeof options === "string" ? options : options.type,
      value: actual,
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
