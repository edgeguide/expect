export function validateNumber({ value }: { value: unknown }) {
  return { valid: typeof value === "number" && !isNaN(value) };
}
