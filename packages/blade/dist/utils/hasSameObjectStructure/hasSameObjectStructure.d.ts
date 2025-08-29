export interface ObjectWithKeys {
    [key: string | number]: ObjectWithKeys | number | string;
}
declare const hasSameObjectStructure: (obj1: ObjectWithKeys, obj2: ObjectWithKeys) => boolean;
export { hasSameObjectStructure };
