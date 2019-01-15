export function validatePhone({ value }: { value: number | string }) {
  return {
    valid:
      (typeof value === 'number' && Number.isInteger(value)) ||
      (typeof value === 'string' && /^\+?[\d\s()]+$/.test(value))
  };
}
