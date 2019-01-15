export function validateBoolean({ value }: { value: boolean }) {
  return { valid: typeof value === 'boolean' };
}
