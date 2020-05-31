import { ExpectTypes } from "../types";
import { ValidateFunction } from "../definitions";
import { getDeep, getDeepOptions } from "./getDeep";
import isDateValue from "./isDateValue";

export function isEqualTo({
  type,
  value,
  equalTo,
  actualValues,
  expected,
  validate,
}: {
  type: ExpectTypes;
  value: unknown;
  equalTo: string | string[];
  actualValues: unknown;
  expected: Record<string, any>;
  validate: ValidateFunction;
}) {
  const initialValue = getDeep(equalTo, actualValues);
  const options = getDeepOptions(equalTo, expected);

  const validated = !options
    ? { parsed: initialValue }
    : validate({
        type: options.type || options,
        parameter: equalTo,
        value: initialValue,
        options,
        actualValues,
        expected,
      });

  if ("parsed" in validated)
    return type !== "date"
      ? value === validated.parsed
      : isDateValue(value) &&
          isDateValue(validated.parsed) &&
          new Date(value).getTime() === new Date(validated.parsed).getTime();

  return value === undefined;
}
