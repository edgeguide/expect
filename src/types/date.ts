export function validateDate({ value }: { value: unknown }) {
  return {
    valid:
      (value instanceof Date && value.toString() !== "Invalid Date") ||
      (typeof value === "string" &&
        new Date(value).toString() !== "Invalid Date"),
  };
}
