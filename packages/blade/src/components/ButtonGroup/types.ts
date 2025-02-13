import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { ButtonProps } from '~components/Button/Button';
import type { DataAnalyticsAttribute } from '~utils/types';

type ButtonGroupProps = {
  /**
   * Accepts multiple Button components as children
   */
  children: React.ReactNode;
  /**
   * Specifies the visual style variant of the ButtonGroup.
   *
   * @default 'primary'
   */
  variant?: ButtonProps['variant'];
  /**
   * Specifies the size of the ButtonGroup.
   *
   * @default 'medium'
   */
  size?: ButtonProps['size'];
  /**
   * Specifies the color of the ButtonGroup.
   *
   * @default 'primary'
   */
  color?: ButtonProps['color'];
  /**
   * Specifies whether the ButtonGroup should take up the full width of its container.
   */
  isFullWidth?: boolean;
  /**
   * Disables or enables the ButtonGroup component
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Test ID for automation
   */
  testID?: string;
} & DataAnalyticsAttribute &
  StyledPropsBlade;

type StyledButtonGroupProps = Pick<
  ButtonGroupProps,
  'isDisabled' | 'color' | 'variant' | 'isFullWidth'
>;

type ButtonGroupContextType = Pick<
  ButtonGroupProps,
  'isDisabled' | 'isFullWidth' | 'size' | 'color' | 'variant'
>;

export type { ButtonGroupProps, StyledButtonGroupProps, ButtonGroupContextType };
