/* eslint-disable @typescript-eslint/no-explicit-any */
function getIn(obj: Record<string, any>, path: string): any {
  if (!path) {
    return undefined;
  }

  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    result = result?.[key];
    if (result === undefined) {
      return undefined;
    }
  }

  return result;
}

export default getIn;
