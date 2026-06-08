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
  borderRadius: BorderRadiusValues;
  height?: string;
  width?: string;
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
  borderRadius: BorderRadiusValues;
  borderWidth?: string;
  accessibilityProps: Record<string, unknown>;
  isPressed: boolean;
} & StyledPropsBlade &
  BladeCommonEvents;

export type AnimatedButtonContentProps = Pick<
  StyledBaseButtonProps,
  'motionDuration' | 'motionEasing' | 'isPressed'
>;
