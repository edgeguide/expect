export function validateDate({ value }: { value: Date | string }) {
  return {
    valid:
      (value instanceof Date && value.toString() !== 'Invalid Date') ||
      (typeof value === 'string' &&
        new Date(value).toString() !== 'Invalid Date')
  };
}
