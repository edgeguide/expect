import { IStringOption } from "../definitions";
import { formatParameter, sanitize, containsUnsafe } from "../util";

export function validateString({
  parameter,
  value,
  options
}: {
  parameter: string | string[];
  value: string;
  options: IStringOption;
}) {
  if (typeof value !== "string") {
    return { valid: false };
  }

  if (
    options.blockUnsafe &&
    containsUnsafe({
      value,
      strict: options.strictEntities,
      allowed: options.allowed
    })
  ) {
    return {
      valid: false,
      error:
        options.blockUnsafeErrorCode ||
        options.errorCode ||
        `Parameter ${formatParameter(
          parameter
        )} contained unsafe, unescaped characters`
    };
  }

  return {
    valid: true,
    parsed: options.sanitize
      ? sanitize({
          value,
          strict: options.strictEntities,
          allowed: options.allowed
        })
      : value
  };
}
