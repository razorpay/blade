declare function keys<T extends Record<string, any>>(obj: T): Array<keyof T>;
export default keys;
