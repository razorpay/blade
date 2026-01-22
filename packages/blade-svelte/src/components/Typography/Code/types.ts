import type { Snippet } from 'svelte';
import type { StyledPropsBlade } from '@razorpay/blade-core/utils';
import type { BaseTextProps, BaseTextSizes } from '../BaseText/types';

type CodeHighlightedProps = {
  /**
   * Sets the color of the Code component.
   * Should be a string value (token, variable name, or code snippet).
   */
  children: Snippet | string;
  /**
   * Decides the fontSize and padding of Code
   *
   * @default small
   */
  size?: Extract<BaseTextSizes, 'small' | 'medium'>;
  weight?: Extract<BaseTextProps['fontWeight'], 'regular' | 'bold'>;
  /**
   * Adds background color to highlight the text
   *
   * @default true
   */
  isHighlighted?: true;
  textTransform?: BaseTextProps['textTransform'];
  /**
   * color prop can only be added when `isHighlighted` is set to `false`
   */
  color?: undefined;
  testID?: string;
} & StyledPropsBlade;

type CodeNonHighlightedProps = {
  /**
   * Sets the color of the Code component.
   * Should be a string value (token, variable name, or code snippet).
   */
  children: Snippet | string;
  /**
   * Decides the fontSize and padding of Code
   *
   * @default small
   */
  size?: Extract<BaseTextSizes, 'small' | 'medium'>;
  weight?: Extract<BaseTextProps['fontWeight'], 'regular' | 'bold'>;
  /**
   * Adds background color to highlight the text
   *
   * @default true
   */
  isHighlighted: false;
  textTransform?: BaseTextProps['textTransform'];
  /**
   * color prop to set color of text when `isHighlighted` is set to false
   */
  color?: BaseTextProps['color'];
  testID?: string;
} & StyledPropsBlade;

export type CodeProps = CodeHighlightedProps | CodeNonHighlightedProps;
