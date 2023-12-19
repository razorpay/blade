/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */
import type { EasingType } from '~tokens/global/motion';

/**
 * @template TokenType token type generic
 * @description Tokenises objects to dot notation strings, eg: `surface.text.normal.lowContrast`
 */
export type DotNotationToken<_TokenType, TokenType = Omit<_TokenType, 'name'>> = {
<<<<<<< HEAD
  [K in keyof TokenType]: `${Extract<K, number | string>}.${TokenType[K] extends Record<
    string,
    string | number | boolean | EasingType<string>
  >
    ? Extract<keyof TokenType[K], number | string>
    : DotNotationToken<TokenType[K]>}`;
=======
  [K in keyof TokenType]: TokenType[K] extends string
    ? `${Extract<K, number | string>}`
    : `${Extract<K, number | string>}.${TokenType[K] extends Record<
        string,
        string | number | boolean | EasingType<string>
      >
        ? Extract<keyof TokenType[K], number | string>
        : DotNotationToken<TokenType[K]>}`;
>>>>>>> f6084c01de591ba8c809eea3703e3eab0f0c02b8
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
