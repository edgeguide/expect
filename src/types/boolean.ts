export function validateBoolean({ value }: { value: unknown }) {
  return { valid: typeof value === "boolean" };
}
