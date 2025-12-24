/* eslint-disable @typescript-eslint/no-explicit-any */
export default function isUndefined(value: any): value is undefined {
  return typeof value === 'undefined';
}

