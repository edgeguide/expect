export default function isDateValue(
  value: unknown
): value is Date | string | number {
  return (
    value instanceof Date ||
    typeof value === "string" ||
    typeof value === "number"
  );
}
