import type { StyledPropsBlade } from '@razorpay/blade-core/utils';

export type DividerProps = {
  /**
   * Orientation of the divider
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Style of the divider
   * @default 'solid'
   */
  dividerStyle?: 'solid' | 'dashed';

  /**
   * Visual variant
   * @default 'muted'
   */
  variant?: 'normal' | 'subtle' | 'muted';

  /**
   * Thickness of the divider
   * @default 'thin'
   */
  thickness?: 'thinner' | 'thin' | 'thick' | 'thicker';

  /**
   * Custom height (use only when parent is not flex)
   */
  height?: string;

  /**
   * Custom width (use only when parent is not flex)
   */
  width?: string;

  /**
   * Test ID
   */
  testID?: string;
} & StyledPropsBlade;

