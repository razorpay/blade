// eslint-disable-next-line @typescript-eslint/no-explicit-any
function objectKeysWithType<T extends Record<any, any>>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

export { objectKeysWithType };
