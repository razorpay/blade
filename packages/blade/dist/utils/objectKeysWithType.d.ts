declare function objectKeysWithType<T extends Record<any, any>>(obj: T): (keyof T)[];
export { objectKeysWithType };
