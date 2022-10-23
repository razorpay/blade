/**
 * Exact<> type ensures that a generic function accepts exact props, no exccess props
 * @see https://github.com/microsoft/TypeScript/issues/12936#issuecomment-368244671
 * @example
 *
 * ```ts
 * type UserOptions = { name: string; age: number };
 *
 * function makeUser<T extends UserOptions>(props: T) {}
 * makeUser({ name: '', age: 1, nice: 2 });
 * //                           ^ doesn't throw error
 *
 * function makeUserExact<T extends Exact<UserOptions, T>>(props: T) {}
 * makeUserExact({ name: '', age: 1, nice: 2 });
 * //                                ^ correctly throw error
 * ```
 */
export type Exact<T, X extends T> = T &
  {
    [K in keyof X]: K extends keyof T ? X[K] : never;
  };

export type PathProps = {
  clipPath?: string;
  clipRule?: 'evenodd' | 'nonzero';
  d: string;
  fill?: string;
  fillOpacity?: number;
  fillRule?: 'evenodd' | 'nonzero';
  stroke?: string;
  strokeLinecap?: 'butt' | 'round' | 'square';
  strokeLinejoin?: 'bevel' | 'miter' | 'round';
  strokeWidth?: string;
};
