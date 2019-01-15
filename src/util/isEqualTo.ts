import { ExpectedType, ValidateFunction } from '../definitions';
import { getDeep, getDeepOptions } from './getDeep';

export function isEqualTo({
  value,
  type,
  equalTo,
  actualValues,
  expected,
  validate
}: {
  value: any;
  type: ExpectedType;
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

  return type === 'date'
    ? new Date(value).getTime() === new Date(parsed).getTime()
    : value === parsed;
}
