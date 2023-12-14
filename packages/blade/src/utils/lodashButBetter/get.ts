/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */
import type { EasingFactoryFn } from '~tokens/global';

/**
 * @template TokenType token type generic
 * @description Tokenises objects to dot notation strings, eg: `surface.text.normal.lowContrast`
 */
export type DotNotationToken<TokenType> = {
  [K in keyof TokenType]: `${Extract<K, number | string>}.${TokenType[K] extends Record<
    string,
    string | number | boolean | EasingFactoryFn
  >
    ? Extract<keyof TokenType[K], number | string>
    : DotNotationToken<TokenType[K]>}`;
}[keyof TokenType];

/* eslint-disable @typescript-eslint/no-explicit-any */
function getIn<
  T extends Record<string, any>,
  K extends DotNotationToken<T>,
  Default extends any = any
>(obj: T, path: K, defaultValue?: Default): any {
  if (!path) {
    return defaultValue;
  }

  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    result = result?.[key];
    if (result === undefined) {
      return defaultValue;
    }
  }

  return result !== undefined ? result : defaultValue;
}

export default getIn;
