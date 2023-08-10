export function isUnsafe(key: unknown) {
  if (key === "__proto__" || key === "constructor" || key === "prototype") {
    return true;
  }

  return false;
}
