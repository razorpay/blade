import type React from 'react';
import type { ViewStyle } from 'react-native';
import type { CSSObject } from 'styled-components';
import type { Spacing, EasingFunctionFactory } from '~tokens/global';
import type { Platform } from '~utils';

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
 * Similar to Partial except it keeps key as required and only supports undefined as explicit value
 */
type AllowUndefinedValue<T> = {
  [P in keyof T]: T[P] | undefined;
};

/**
 * Similar to `Required` except it allows undefined as value.
 * So all keys have to be explicitly defined, but they can have undefined as value
 */
type KeysRequired<T> = AllowUndefinedValue<Required<T>>;

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

/**
 *
 * When combined with union, this type utility will give you autocomplete of union while still supporting any string value as input
 *
 * ### Usage
 *
 * ```ts
 * type ThemeName = 'paymentTheme' | 'bankingTheme' | StringWithAutocomplete;
 * ```
 *
 * This will show paymentTheme and bankingTheme in autocomplete but also allow any other string as value.
 *
 * More details - https://github.com/razorpay/blade/pull/1031/commits/86b6ee0facf45e7556739efcbfa5396b11b1b3c9#r1121298293
 * Related TS Issue - https://github.com/microsoft/TypeScript/issues/29729
 *
 */
type StringWithAutocomplete = string & Record<never, never>;

type TestID = {
  testID?: string;
};

/**
 * Similar to `Pick` except this returns `never` when value doesn't exist (native `Pick` returns `unknown`).
 *
 * You might have to ts-ignore the non-existing type error while using this. This is done so that you can get jsdoc from actual type.
 *
 * E.g. This will pick from ViewStyle prop if value exists else returns undefined.
 *
 * ```ts
 * // @ts-expect-error: T passed here may not neccessarily exist. We return `never` type when it doesn't
 * native: PickIfExist<ViewStyle, T>;
 * ```
 */
type PickIfExist<T, K extends keyof T> = {
  [P in K]: P extends keyof T ? T[P] : never;
};

/**
 * Picks the types based on the platform (web / native).
 *
 * E.g.
 * ```ts
 * type CSSObject = PickCSSByPlatform<'display'>
 * // On Web --> This will be all possible web display properties like `block`, `flex`, `inline`, and more.
 * // On Native --> This will be just `flex` and `none`
 * ```
 */
type PickCSSByPlatform<T extends keyof React.CSSProperties | keyof ViewStyle> = Platform.Select<{
  web: PickIfExist<CSSObject, T>;
  // @ts-expect-error: T passed here may not neccessarily exist. We return `never` type when it doesn't
  native: PickIfExist<ViewStyle, T>;
}>;

export {
  DotNotationColorStringToken,
  DotNotationMotionStringToken,
  DotNotationSpacingStringToken,
  KeysRequired,
  StringChildrenType,
  StringWithAutocomplete,
  TestID,
  PickIfExist,
  PickCSSByPlatform,
};
