/* eslint-disable @typescript-eslint/no-explicit-any */
function isObject(value: any): value is Record<string, any> {
  return typeof value === 'object' && value !== null;
}

export default isObject;
