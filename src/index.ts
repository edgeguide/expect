import { IErrorObject, ExpectedType, Options } from './definitions';
import { validate } from './types';

export = (
  expected: { [key: string]: ExpectedType | Options },
  actualValues: { [key: string]: any }
) => {
  if (expected === null || typeof expected !== 'object') {
    throw new Error('Invalid validation schema');
  }

  const parsedValues: { [key: string]: any } = {};
  const errors: IErrorObject = {};
  let valid = true;

  Object.keys(expected).forEach(parameter => {
    if (actualValues === null || typeof actualValues !== 'object') {
      valid = false;
      errors[parameter] = 'Invalid input';
      return;
    }

    const options = expected[parameter];
    const actual = actualValues[parameter];

    const validation = validate({
      type: typeof options === 'string' ? options : options.type,
      parameter,
      value: actual,
      options,
      actualValues,
      expected
    });

    if (!validation.valid) {
      valid = false;
      errors[parameter] = validation.error;
      return;
    }

    if (validation.parsed !== undefined) {
      parsedValues[parameter] = validation.parsed;
    }
  });

  return {
    wereMet: () => valid,
    errors: () => errors,
    getParsed: () => parsedValues
  };
};
