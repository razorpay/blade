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
   * True when this Button is the first child of a ButtonGroup.
   *
   * On web, CSS (`backgroundImage: none` on `:not(:first-child)`) removes the
   * primary radial glow from non-first buttons. React Native has no CSS
   * selectors, so BaseButton reads this to hide the native shadow gradient.
   */
  isFirstInButtonGroup?: boolean;
  /**
   * True when this Button is the last child of a ButtonGroup.
   *
   * On web, CSS rounds only the outer edges of the group. React Native has no
   * CSS cascade, so BaseButton reads `isFirstInButtonGroup`/`isLastInButtonGroup`
   * to round only the outer corners of the first and last buttons (and their
   * native border overlay) so the group's rounded corners aren't clipped.
   */
  isLastInButtonGroup?: boolean;
  /**
   * When true, non-first buttons should pull 1px left to collapse the doubled
   * border between adjacent buttons. Computed by ButtonGroup based on its
   * variant (secondary/tertiary) so BaseButton doesn't need to inspect the
   * variant string.
   *
   * Cleared for the sibling after a pressed button so that button's highlighted
   * right border isn't covered by the -1px overlap while pressed.
   */
  collapseBorder?: boolean;
  /**
   * Index of this child inside ButtonGroup. Used with `setPressedButtonIndex`
   * so the group can raise z-index / release border collapse while pressed.
   */
  buttonIndex?: number;
  /**
   * Reports press in/out from a grouped Button so ButtonGroup can show the
   * full highlighted border (including the right edge) while pressed.
   */
  setPressedButtonIndex?: (index: number | null) => void;
};

export type { ButtonGroupProps, StyledButtonGroupProps, ButtonGroupContextType };
