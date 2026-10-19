function isNonNullObject(o: unknown): o is object {
  return o !== null && typeof o === 'object';
}

export function hasOwn(obj: unknown, prop: PropertyKey): boolean {
  return isNonNullObject(obj) ? Object.prototype.hasOwnProperty.call(obj, prop) : false;
}
