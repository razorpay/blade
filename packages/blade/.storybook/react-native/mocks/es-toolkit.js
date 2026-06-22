// Hermes-compatible es-toolkit mock.
// Hermes in RN 0.72 doesn't support Unicode property escapes (\p{Lu}) used in es-toolkit/string.
// Only mergeWith and isEqual are needed by @storybook/react-native-ui-common.

function isEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;
  if (typeof a !== 'object') return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((v, i) => isEqual(v, b[i]));
  }
  if (Array.isArray(a) !== Array.isArray(b)) return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    if (!isEqual(a[key], b[key])) return false;
  }
  return true;
}

function mergeWith(target, source, customizer) {
  if (!source) return target;
  const result = { ...target };
  for (const key of Object.keys(source)) {
    const customResult = customizer
      ? customizer(result[key], source[key], key, result, source)
      : undefined;
    if (customResult !== undefined) {
      result[key] = customResult;
    } else if (
      typeof result[key] === 'object' &&
      result[key] !== null &&
      typeof source[key] === 'object' &&
      source[key] !== null &&
      !Array.isArray(result[key]) &&
      !Array.isArray(source[key])
    ) {
      result[key] = mergeWith(result[key], source[key], customizer);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

module.exports = { isEqual, mergeWith };
