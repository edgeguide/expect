export function validateNumber({ value }: { value: number }) {
  return { valid: typeof value === "number" && !isNaN(value) };
}
