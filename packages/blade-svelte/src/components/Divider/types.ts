import type { StyledPropsBlade } from '@razorpay/blade-core/utils';
import type { BaseDividerProps } from './BaseDivider/types';

export type DividerProps = BaseDividerProps & {
  /**
   * Sets the orientation of divider
   *
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Sets the style of divider
   *
   * @default 'solid'
   */
  dividerStyle?: 'solid' | 'dashed';
  /**
   * Sets the variant of divider
   *
   * @default 'muted'
   */
  variant?: 'normal' | 'subtle' | 'muted';
  /**
   * Sets the thickness of divider
   *
   * @default 'thin'
   */
  thickness?: 'thinner' | 'thin' | 'thick' | 'thicker';
  /**
   * Sets the height of divider. Divider uses Flex by default, use height only when parent is not flex.
   *
   */
  height?: string;
  /**
   * Sets the width of divider. Divider uses Flex by default, use width only when parent is not flex.
   *
   */
  width?: string;
  /**
   * Test ID for testing purposes
   */
  testID?: string;
} & StyledPropsBlade;
