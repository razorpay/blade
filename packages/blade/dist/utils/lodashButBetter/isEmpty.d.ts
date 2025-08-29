type Collection = Record<string, any> | any[] | Set<any> | Map<any, any> | string | number | boolean | null | undefined;
export default function isEmpty(value: Collection): value is null | undefined;
export {};
