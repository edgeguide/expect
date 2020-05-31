import { ExpectTypes } from "../types";
import { ValidateFunction } from "../definitions";
import { getDeep, getDeepOptions } from "./getDeep";
import isDateValue from "./isDateValue";
import { formatParameter } from ".";

export function isEqualTo({
  type,
  value,
  parameter,
  equalTo,
  actualValues,
  expected,
  visitedParams = [],
  validate,
}: {
  type: ExpectTypes;
  value: unknown;
  parameter: string | number | Array<string | number>;
  equalTo: string | string[];
  actualValues: unknown;
  expected: Record<string, any>;
  visitedParams: Array<string | number>;
  validate: ValidateFunction;
}) {
  const initialValue = getDeep(equalTo, actualValues);
  const options = getDeepOptions(equalTo, expected);

  const validated =
    !options || visitedParams.includes(formatParameter(parameter))
      ? { parsed: initialValue }
      : validate({
          type: options.type || options,
          parameter: equalTo,
          value: initialValue,
          options,
          actualValues,
          expected,
          visitedParams: visitedParams.concat(formatParameter(parameter)),
        });

  if ("parsed" in validated)
    return type !== "date"
      ? value === validated.parsed
      : isDateValue(value) &&
          isDateValue(validated.parsed) &&
          new Date(value).getTime() === new Date(validated.parsed).getTime();

  return value === undefined;
}
