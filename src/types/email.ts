import * as XRegExp from "xregexp";
import { IEmailOption } from "../definitions";
import { formatParameter, containsUnsafe } from "../util";
const alphanumericRegexp = XRegExp("^[\\p{L}0-9\\s]+$");
const EMAIL_REGEXP = /.+@.+/;
const STRICT_EMAIL_REGEXP = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export function validateEmail({
  parameter,
  value,
  options
}: {
  parameter: string | string[];
  value: string;
  options: IEmailOption;
}) {
  const regexp = options.strict ? STRICT_EMAIL_REGEXP : EMAIL_REGEXP;
  if (typeof value !== "string" || !regexp.test(value)) {
    return { valid: false };
  }

  const allowedCharacters = Array.isArray(options.allowed)
    ? options.allowed.concat("@")
    : ["@"]; // Always allow @ for email adresses, even when blocking unsafe

  if (
    options.blockUnsafe &&
    containsUnsafe({
      value,
      strict: options.strictEntities,
      allowed: allowedCharacters
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

  if (options.alphanumeric && !alphanumericRegexp.test(value)) {
    return {
      valid: false,
      error:
        options.alphanumericErrorCode ||
        options.errorCode ||
        `Parameter ${formatParameter(
          parameter
        )} contained non-alphanumeric characters`
    };
  }

  return { valid: true };
}
