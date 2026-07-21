import type { ReactNode } from 'react';
import type { ButtonMinHeight } from './buttonTokens';
import type { BaseButtonProps } from './BaseButton';
import type { DurationString, EasingString } from '~tokens/global';
import type { BorderRadiusValues, SpacingValues } from '~tokens/theme/theme';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { BladeCommonEvents } from '~components/types';
import type { IconProps, IconSize } from '~components/Icons';
import type { BaseSpinnerProps } from '~components/Spinner/BaseSpinner';
import type { Theme } from '~components/BladeProvider';
import type { DataAnalyticsAttribute, DotNotationSpacingStringToken } from '~utils/types';
import type { BaseTextProps } from '~components/Typography/BaseText/types';
import type { DotNotationToken } from '~utils/lodashButBetter/get';

/**
 * All possible icon colors, derived from `IconProps` minus `currentColor` because possible values should only be from tokens
 */
export type IconColor = Exclude<IconProps['color'], 'currentColor'>;

/**
 * Per-corner border radii (in px). Used on React Native to round only the outer
 * corners of the first/last buttons inside a ButtonGroup.
 */
export type ButtonCornerRadii = {
  topLeft: number;
  topRight: number;
  bottomLeft: number;
  bottomRight: number;
};

export type BaseButtonStyleProps = {
  iconSize: IconSize;
  spinnerSize: BaseSpinnerProps['size'];
  fontSize: keyof Theme['typography']['fonts']['size'];
  lineHeight: keyof Theme['typography']['lineHeights'];
  minHeight: `${ButtonMinHeight}px`;
  iconPadding?: DotNotationSpacingStringToken;
  iconColor: IconColor;
  textColor: BaseTextProps['color'];
  buttonPaddingTop: SpacingValues;
  buttonPaddingBottom: SpacingValues;
  buttonPaddingLeft: SpacingValues;
  buttonPaddingRight: SpacingValues;
  text?: string;
  defaultBackgroundColor: string;
  defaultBoxShadow?: string;
  hoverBackgroundColor: string;
  hoverBoxShadow?: string;
  hoverIconColor: string;
  focusBackgroundColor: string;
  focusBoxShadow?: string;
  focusRingColor: string;
  motionDuration: DurationString;
  motionEasing: EasingString;
  borderRadius: BorderRadiusValues | number;
  height?: string;
  width?: string;
  shadowHighlightColor?: string;
  shadowHighlightHeight?: number;
  shadowBottomColor?: string;
  shadowBottomHeight?: number;
  shadowBorderColor?: string;
  /** Highlighted/focus border color for native press feedback (matches web `:active`). */
  focusShadowBorderColor?: string;
  shadowRingWidth?: number;
  isShadowGradientVisible?: boolean;
};

export type StyledBaseButtonProps = Omit<
  BaseButtonProps,
  'icon' | 'children' | 'accessibilityLabel' | keyof DataAnalyticsAttribute
> & {
  minHeight: `${ButtonMinHeight}px`;
  height?: BaseButtonStyleProps['height'];
  width?: BaseButtonStyleProps['width'];
  buttonPaddingTop: SpacingValues;
  buttonPaddingBottom: SpacingValues;
  buttonPaddingLeft: SpacingValues;
  buttonPaddingRight: SpacingValues;
  children: ReactNode;
  defaultBackgroundColor: string;
  defaultBorderColor?: string;
  defaultBoxShadow?: string;
  disabled: boolean;
  focusBoxShadow?: string;
  focusBackgroundColor: string;
  focusBorderColor?: string;
  focusRingColor: string;
  hoverBoxShadow?: string;
  hoverBackgroundColor: string;
  hoverBorderColor?: string;
  hoverIconColor: DotNotationToken<Theme['colors']>;
  isFullWidth: boolean;
  motionDuration: DurationString;
  motionEasing: EasingString;
  borderRadius: BorderRadiusValues | number;
  borderRadii?: ButtonCornerRadii;
  /**
   * When true, pulls the button 1px to the left so its border overlaps the
   * previous button's border. Used on React Native for secondary/tertiary
   * ButtonGroups (which separate buttons via their own gray border rather than a
   * divider) to collapse the two adjacent borders into a single line, matching
   * web's `marginLeft: -1px` behaviour.
   */
  isGroupBorderCollapsed?: boolean;
  /**
   * When true, the inset highlight/shadow overlay draws only horizontal edges
   * (top/bottom), pushing vertical sides outside the button bounds so they are
   * clipped. Prevents doubled inset shadow thickness at ButtonGroup junctions.
   */
  isInsetShadowSidesFlattened?: boolean;
  /**
   * When true (React Native ButtonGroup with `isFullWidth`), use `flex: 1`
   * instead of `width: 100%` so sibling buttons share the row equally. Web
   * does this via CSS child selectors (`flex: 1`); native has no cascade.
   */
  isInsideFullWidthButtonGroup?: boolean;
  borderWidth?: string;
  shadowHighlightColor?: string;
  shadowHighlightHeight?: number;
  shadowBottomColor?: string;
  shadowBottomHeight?: number;
  shadowBorderColor?: string;
  /** Highlighted/focus border color for native press feedback (matches web `:active`). */
  focusShadowBorderColor?: string;
  shadowRingWidth?: number;
  isShadowGradientVisible?: boolean;
  accessibilityProps: Record<string, unknown>;
  isPressed: boolean;
  isDefiniteLoading?: boolean;
} & StyledPropsBlade &
  BladeCommonEvents;

export type AnimatedButtonContentProps = Pick<
  StyledBaseButtonProps,
  'motionDuration' | 'motionEasing' | 'isPressed'
>;
