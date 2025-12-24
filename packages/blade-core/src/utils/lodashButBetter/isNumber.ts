/* eslint-disable @typescript-eslint/no-explicit-any */
function isNumber(value: any): value is number {
  return typeof value === 'number' && isFinite(value);
}

export default isNumber;

