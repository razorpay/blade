import type { Snippet } from 'svelte';
import type { StyledPropsBlade } from '@razorpay/blade-core/utils';
import type { BaseTextProps, BaseTextSizes } from '../BaseText/types';

export const validAsValues = ['span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

export type HeadingProps = {
  as?: typeof validAsValues[number];
  /**
   * Overrides the color of the Heading component.
   *
   * **Note** This takes priority over `type` and `contrast` prop to decide color of heading
   */
  color?: BaseTextProps['color'];
  weight?: Extract<BaseTextProps['fontWeight'], 'regular' | 'medium' | 'semibold'>;
  children: Snippet;
  textAlign?: BaseTextProps['textAlign'];
  textDecorationLine?: BaseTextProps['textDecorationLine'];
  size?: Extract<BaseTextSizes, 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge'>;
  textTransform?: BaseTextProps['textTransform'];
  wordBreak?: BaseTextProps['wordBreak'];
  testID?: string;
} & StyledPropsBlade;

