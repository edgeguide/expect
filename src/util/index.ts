import { getDeep, getDeepOptions } from "./getDeep";
import { isEqualTo } from "./isEqualTo";
import { parseFunctionWrapper, parseType } from "./parse";

export {
  formatParameter,
  isEqualTo,
  getDeep,
  getDeepOptions,
  parseType,
  parseFunctionWrapper,
  isNull,
  sanitize,
  containsUnsafe,
};

function formatParameter(
  parameter: string | number | Array<string | number>
): string | number {
  return Array.isArray(parameter) ? parameter.join(".") : parameter;
}

const htmlEntityMap: {
  [key: string]: string;
} = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
  "!": "&excl;",
  "@": "&commat;",
  $: "&dollar;",
  "(": "&lpar;",
  ")": "&rpar;",
  "=": "&equals;",
  "+": "&plus;",
  "{": "&lbrace;",
  "}": "&rbrace;",
  "[": "&lbrack;",
  "]": "&rbrack;",
};

const nonStrictSubset = ["&", "<", ">", '"', "'"];

function containsUnsafe({
  value,
  strict,
  allowed = [],
}: {
  value: string;
  strict?: boolean;
  allowed?: string[];
}): boolean {
  return Array.from(value).some((character) => {
    if (!strict && !nonStrictSubset.includes(character)) return false;
    if (allowed.includes(character)) return false;
    return htmlEntityMap[character] !== undefined;
  });
}

function sanitize({
  value,
  strict,
  allowed = [],
}: {
  value: string;
  strict?: boolean;
  allowed?: string[];
}): string {
  return Array.from(value).reduce(
    (sanitized, char) =>
      !htmlEntityMap[char] ||
      allowed.includes(char) ||
      (!strict && !nonStrictSubset.includes(char))
        ? `${sanitized}${char}`
        : `${sanitized}${htmlEntityMap[char]}`,
    ""
  );
}

function isNull(value: unknown): value is undefined | null | "" {
  return value == null || value === "";
}
