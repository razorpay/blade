import type React from 'react';
import type { Spacing } from '~tokens/global';
import type { EasingFunctionFactory } from '~tokens/global/motion';

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

type DotNotationMotionStringToken<TokenType> = {
  [K in keyof TokenType]: `${Extract<K, string>}.${TokenType[K] extends Record<
    string,
    string | EasingFunctionFactory
  >
    ? Extract<keyof TokenType[K], string | EasingFunctionFactory>
    : DotNotationMotionStringToken<TokenType[K]>}`;
}[keyof TokenType];

type DotNotationSpacingStringToken = `spacing.${keyof Spacing}`;

/**
 * Use this when you want children to be string.
 *
 * This covers scenarios like
 * ```jsx
 * <Title>Hi</Title>
 * <Title>{dynamicVariable} something</Title>
 * ```
 *
 *
 * ### Usage
 *
 * ```ts
 * import type { StringChildrenType } from '~helpers/types';
 *
 * type MyProps = {
 *  children: StringChildrenType;
 * }
 * ```
 */
type StringChildrenType = React.ReactText | React.ReactText[];

export {
  DotNotationColorStringToken,
  DotNotationMotionStringToken,
  DotNotationSpacingStringToken,
  StringChildrenType,
};
