import type { DividerSlot, StyleOverride } from '@razorpay/blade-core/styles';
import type { StyledPropsBlade } from '@razorpay/blade-core/utils';

export type DividerProps = {
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
   * Test ID for testing
   */
  testID?: string;
  /**
   * Additional class names
   */
  class?: string;
  /**
   * Per-slot classname overrides. Merged under provider `componentConfig.Divider.styleOverride`;
   * instance values win on conflicts.
   */
  styleOverride?: StyleOverride<DividerSlot>;
} & StyledPropsBlade;
