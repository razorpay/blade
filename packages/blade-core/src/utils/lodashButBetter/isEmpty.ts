/* eslint-disable @typescript-eslint/no-explicit-any */
type Collection =
  | Record<string, any>
  | any[]
  | Set<any>
  | Map<any, any>
  | string
  | number
  | boolean
  | null
  | undefined;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function isEmpty(value: Collection): value is null | undefined {
  // Check if the value is null or undefined
  if (value == null) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  // Check if the value is a collection, map, or set and has zero size
  if (value instanceof Map || value instanceof Set) {
    return value.size === 0;
  }

  // Check if the value is an object and has no own enumerable properties
  if (typeof value === 'object' && Object.keys(value).length === 0) {
    return true;
  }

  // Check if the value is a string and has zero length
  if (typeof value === 'string' && value.length === 0) {
    return true;
  }

  // https://github.com/lodash/lodash/issues/496#issuecomment-37692727
  if (typeof value === 'number' || typeof value === 'boolean') {
    return true;
  }

  return false;
}
