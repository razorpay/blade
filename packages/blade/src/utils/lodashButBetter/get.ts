/* eslint-disable @typescript-eslint/no-explicit-any */
function getIn(obj: Record<string, any>, path: string, defaultValue?: any): any {
  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    result = result?.[key];
    if (result === undefined) {
      return defaultValue;
    }
  }

  return result !== undefined ? result : defaultValue;
}

export default getIn;
