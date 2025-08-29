export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends Record<number | string, unknown> ? DeepPartial<T[P]> : T[P];
};
export declare const isPartialMatchObjectKeys: <ActualObject>({ objectToMatch, objectToInspect, }: {
    objectToMatch: DeepPartial<ActualObject>;
    objectToInspect: ActualObject;
}) => boolean;
