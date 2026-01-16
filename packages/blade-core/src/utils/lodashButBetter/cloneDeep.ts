/* eslint-disable @typescript-eslint/no-explicit-any */
function cloneDeep<T>(source: T): T {
  if (source === null || typeof source !== 'object') {
    return source;
  }

  if (Array.isArray(source)) {
    const newArray: any[] = [];
    for (const item of source) {
      newArray.push(cloneDeep(item));
    }
    return newArray as T;
  }

  if (typeof source === 'object') {
    const newObject: Record<string, any> = {};
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        newObject[key] = cloneDeep(source[key]);
      }
    }
    return newObject as T;
  }

  return source;
}

export default cloneDeep;
