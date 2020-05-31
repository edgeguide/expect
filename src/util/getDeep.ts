import isRecord from "./isRecord";
export { getDeep, getDeepOptions };

function getDeep(
  chain: string | string[],
  values: unknown
): Record<string, unknown> | unknown | undefined {
  if (!isRecord(values)) return values;

  if (
    typeof chain === "string" &&
    Object.prototype.hasOwnProperty.call(values, chain)
  ) {
    return values[chain];
  }

  if (!Array.isArray(chain)) return undefined;
  if (!chain.length) return values;

  const key = chain[0];
  return getDeep(chain.slice(1), values[key]);
}

function getDeepOptions(
  chain: string | string[],
  options: Record<string, any>
): any {
  if (options === undefined) return undefined;
  if (!Array.isArray(chain)) return options[chain];
  if (!chain.length) return options;

  const key = chain[0];
  let nextOptions = options[key];
  if ("items" in options) nextOptions = options.items[key];
  if ("keys" in options) nextOptions = options.keys[key];
  return getDeepOptions(chain.slice(1), nextOptions);
}
