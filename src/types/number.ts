export function validateNumber({ value }: { value: unknown }) {
  return { valid: typeof value === "number" && !Number.isNaN(value) };
}
