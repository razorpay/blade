/* eslint-disable @typescript-eslint/no-explicit-any */
function keys<T extends Record<string, any>>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>;
}

export default keys;
