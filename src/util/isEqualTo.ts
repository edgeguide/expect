import { ExpectTypes } from "../types/index";
import { ValidateFunction } from "../definitions";
import { getDeep, getDeepOptions } from "./getDeep";
import isDateValue from "./isDateValue";
import { formatParameter } from "./index";

export function isEqualTo({
  type,
  value,
  parameter,
  equalTo,
  input,
  schema,
  visitedParams = [],
  validate,
}: {
  type: ExpectTypes;
  value: unknown;
  parameter: string | number | Array<string | number>;
  equalTo: string | string[];
  input: unknown;
  schema: Record<string, any>;
  visitedParams: Array<string | number>;
  validate: ValidateFunction;
}) {
  const initialValue = getDeep(equalTo, input);
  const options = getDeepOptions(equalTo, schema);

  const validated =
    !options || visitedParams.includes(formatParameter(parameter))
      ? { parsed: initialValue }
      : validate({
          type: options.type || options,
          parameter: equalTo,
          value: initialValue,
          options,
          input,
          schema,
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
