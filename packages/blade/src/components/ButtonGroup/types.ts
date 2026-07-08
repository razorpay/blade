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
  'isDisabled' | 'color' | 'variant' | 'isFullWidth' | 'size'
>;

type ButtonGroupContextType = Pick<
  ButtonGroupProps,
  'isDisabled' | 'isFullWidth' | 'size' | 'color' | 'variant'
> & {
  /**
   * Indicates that the Button is rendered inside a ButtonGroup.
   *
   * On React Native there is no CSS cascade to flatten the border radius of the
   * buttons inside the group, so each Button flattens its own border radius to 0
   * and relies on the group container's `overflow: hidden` + `borderRadius` to
   * round only the outer edges.
   */
  isInsideButtonGroup?: boolean;
};

export type { ButtonGroupProps, StyledButtonGroupProps, ButtonGroupContextType };
