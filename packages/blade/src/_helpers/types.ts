/**
 * @template TokenType token type generic
 * @description Tokenises objects to dot notation strings, eg: `surface.text.normal.lowContrast`
 */
type DotNotationColorStringToken<TokenType> = {
  [K in keyof TokenType]: `${Extract<K, number | string>}.${TokenType[K] extends Record<
    string,
    string
  >
    ? Extract<keyof TokenType[K], number | string>
    : DotNotationColorStringToken<TokenType[K]>}`;
}[keyof TokenType];

type Required<T> = Exclude<T, undefined | null>;

type ValueOf<
  Obj extends ArrayLike<unknown> | Record<string, unknown>,
  Excludes = undefined
> = Obj[Exclude<keyof Obj, Excludes>];

export { DotNotationColorStringToken, Required, ValueOf };
