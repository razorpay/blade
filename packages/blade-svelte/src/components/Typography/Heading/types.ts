import type { Snippet } from 'svelte';
import type { StyledPropsBlade } from '@razorpay/blade-core/utils';
import type { BaseTextProps, BaseTextSizes } from '../BaseText/types';
import type { validHeadingAsValues } from '@razorpay/blade-core/styles';

export type HeadingProps = {
  as?: typeof validHeadingAsValues[number];
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

