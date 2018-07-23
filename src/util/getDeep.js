module.exports = { getDeep, getDeepOptions };

function getDeep(chain, values) {
  if (values === undefined) {
    return undefined;
  }

  if (Object.prototype.hasOwnProperty.call(values, chain)) {
    return values[chain];
  }

  if (!Array.isArray(chain)) {
    return undefined;
  }

  const key = chain[0];
  return getDeep(chain.slice(1), values[key]);
}

function getDeepOptions(chain, values) {
  if (values === undefined) {
    return undefined;
  }

  if (!Array.isArray(chain)) {
    return values[chain];
  }

  if (chain.length === 0) {
    return values;
  }

  const key = chain[0];
  let nextValues = values[key];
  if (Object.prototype.hasOwnProperty.call(values, 'items')) {
    nextValues = values.items[key];
  }
  if (Object.prototype.hasOwnProperty.call(values, 'keys')) {
    nextValues = values.keys[key];
  }
  return getDeepOptions(chain.slice(1), nextValues);
}
