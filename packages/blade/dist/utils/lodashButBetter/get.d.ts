import { ElevationStyles } from '../../tokens/global/elevation';
import { EasingType } from '../../tokens/global/motion';
/**
 * @template TokenType token type generic
 * @description Tokenises objects to dot notation strings, eg: `surface.text.gray.normal`
 */
export type DotNotationToken<_TokenType, TokenType = Omit<_TokenType, 'name'>> = {
    [K in keyof TokenType]: TokenType[K] extends string | number | ElevationStyles ? `${Extract<K, number | string>}` : `${Extract<K, number | string>}.${TokenType[K] extends Record<string, string | number | boolean | EasingType<string>> ? Extract<keyof TokenType[K], number | string> : DotNotationToken<TokenType[K]>}`;
}[keyof TokenType];
declare function getIn<T extends Record<string, any>, K extends DotNotationToken<T>, Default extends any = any>(obj: T, path: K, defaultValue?: Default): any;
export default getIn;
