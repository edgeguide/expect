export { getDeep, getDeepOptions };

function getDeep(
  chain: string | string[],
  values: { [key: string]: any }
): object | undefined {
  if (values === undefined) {
    return values;
  }

  if (
    typeof chain === "string" &&
    Object.prototype.hasOwnProperty.call(values, chain)
  ) {
    return values[chain];
  }

  if (!Array.isArray(chain)) {
    return undefined;
  }

  if (!chain.length) {
    return values;
  }

  const key = chain[0];
  return getDeep(chain.slice(1), values[key]);
}

function getDeepOptions(chain: string | string[], values: any): any {
  if (values === undefined) {
    return undefined;
  }

  if (!Array.isArray(chain)) {
    return values[chain];
  }

  if (!chain.length) {
    return values;
  }

  const key = chain[0];
  let nextValues = values[key];
  if (Object.prototype.hasOwnProperty.call(values, "items")) {
    nextValues = values.items[key];
  }
  if (Object.prototype.hasOwnProperty.call(values, "keys")) {
    nextValues = values.keys[key];
  }
  return getDeepOptions(chain.slice(1), nextValues);
}
