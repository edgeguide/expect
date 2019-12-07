import { IIdentityNumberOption } from "../definitions";

const IDENTITY_NUMBER_REGEXP = /^(?:19|20)?(\d{6}(?:-|\+)?\d{4})$/;
const IDENTITY_NUMBER_REGEXP_STRICT = /^(\d{6}(?:-|\+)?\d{4})$/;

export function validateIdentityNumber({
  value,
  options
}: {
  value: string;
  options: IIdentityNumberOption;
}) {
  const regexp = options.strict
    ? IDENTITY_NUMBER_REGEXP_STRICT
    : IDENTITY_NUMBER_REGEXP;

  if (typeof value !== "string") {
    return { valid: false };
  }

  const matches = regexp.exec(value);
  if (matches === null) {
    return { valid: false };
  }

  if (!verifyLuhn(matches[1].replace(/(\+|-)/, ""))) {
    return { valid: false };
  }

  return { valid: true };
}

function verifyLuhn(value: string) {
  const lastDigit = Number(value[value.length - 1]);
  let calculatedLastDigit = 0;
  for (let i = 0; i < 9; i++) {
    if (i % 2 === 0) {
      const result = 2 * Number(value[i]);
      const firstDigit = Math.floor(result / 10);
      const secondDigit = result % 10;
      calculatedLastDigit += +(firstDigit + secondDigit);
    } else {
      calculatedLastDigit += Number(value[i]);
    }
  }
  calculatedLastDigit = (10 - (calculatedLastDigit % 10)) % 10;

  return lastDigit === calculatedLastDigit;
}
