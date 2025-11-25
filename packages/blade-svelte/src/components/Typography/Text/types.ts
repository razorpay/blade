import type { Snippet } from 'svelte';
import type { BaseTextProps, BaseTextSizes } from '../BaseText/types';
import type { validAsValues } from './utils';
import type { StyledPropsBlade } from '../../../utils/styledProps';

export type TextVariant = 'body' | 'caption';

type TextCommonProps = {
  as?: keyof typeof validAsValues;
  truncateAfterLines?: number;
  children: Snippet;
  weight?: Extract<BaseTextProps['fontWeight'], 'regular' | 'medium' | 'semibold'>;
  /**
   * Overrides the color of the Text component.
   *
   * **Note** This takes priority over `type` and `contrast` prop to decide color of text
   */
  color?: BaseTextProps['color'];
  textAlign?: BaseTextProps['textAlign'];
  textTransform?: BaseTextProps['textTransform'];
  textDecorationLine?: BaseTextProps['textDecorationLine'];
  wordBreak?: BaseTextProps['wordBreak'];
  testID?: string;
} & StyledPropsBlade;

export type TextBodyVariant = TextCommonProps & {
  variant?: Extract<TextVariant, 'body'>;
  size?: Extract<BaseTextSizes, 'xsmall' | 'small' | 'medium' | 'large'>;
};

export type TextCaptionVariant = TextCommonProps & {
  variant?: Extract<TextVariant, 'caption'>;
  size?: Extract<BaseTextSizes, 'small' | 'medium'>;
};

export type TextProps<T> = T extends { variant: infer Variant }
  ? Variant extends 'caption'
    ? TextCaptionVariant
    : Variant extends 'body'
    ? TextBodyVariant
    : T
  : T;

export type GetTextProps<T extends { variant: TextVariant }> = Pick<
  TextProps<T>,
  'variant' | 'weight' | 'size' | 'color' | 'testID' | 'textAlign' | 'textDecorationLine'
>;
