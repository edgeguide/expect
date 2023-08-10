import isRecord from "./isRecord";
import { isUnsafe } from "./validation";
export { getDeep, getDeepOptions };

function getDeep(
  chain: string | string[],
  values: unknown
): Record<string, unknown> | unknown | undefined {
  if (!isRecord(values)) return values;

  if (isUnsafe(chain)) {
    return undefined;
  }

  if (typeof chain === "string") {
    return values[chain];
  }

  if (!Array.isArray(chain)) return undefined;
  if (!chain.length) return values;

  const key = chain[0];

  if (isUnsafe(key)) {
    return undefined;
  }
  return getDeep(chain.slice(1), values[key]);
}

function getDeepOptions(
  chain: string | string[],
  options: Record<string, any>
): any {
  if (isUnsafe(chain)) {
    return undefined;
  }

  if (options === undefined) return undefined;
  if (!Array.isArray(chain)) return options[chain];
  if (!chain.length) return options;

  const key = chain[0];
  if (isUnsafe(key)) {
    return undefined;
  }

  let nextOptions = options[key];
  if ("items" in options) nextOptions = options.items[key];
  if ("keys" in options) nextOptions = options.keys[key];
  return getDeepOptions(chain.slice(1), nextOptions);
}
