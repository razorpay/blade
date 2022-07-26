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

export { DotNotationColorStringToken, DotNotationMotionStringToken, DotNotationSpacingStringToken };
