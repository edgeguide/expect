import { ValidateFunction } from "../definitions";
import { getDeep, getDeepOptions } from "./getDeep";

export function isEqualTo({
  value,
  equalTo,
  actualValues,
  expected,
  validate
}: {
  value: any;
  equalTo: string | string[];
  actualValues: any[];
  expected: object;
  validate: ValidateFunction;
}) {
  const initialValue = getDeep(equalTo, actualValues);
  const options = getDeepOptions(equalTo, expected);

  const { parsed } = !options
    ? { parsed: initialValue }
    : validate({
        type: options.type || options,
        parameter: equalTo,
        value: initialValue,
        options,
        actualValues,
        expected
      });

  return value === parsed;
}
