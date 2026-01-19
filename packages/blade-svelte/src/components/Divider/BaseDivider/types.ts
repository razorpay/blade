import type { StyledPropsBlade } from '@razorpay/blade-core/utils';

export type BaseDividerProps = {
  orientation?: 'horizontal' | 'vertical';
  dividerStyle?: 'solid' | 'dashed';
  variant?: 'normal' | 'subtle' | 'muted';
  thickness?: 'thinner' | 'thin' | 'thick' | 'thicker';
  height?: string;
  width?: string;
  testID?: string;
} & StyledPropsBlade;
