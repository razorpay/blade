import type { ReactNode } from 'react';
import type { ButtonMinHeight } from './buttonTokens';
import type { BaseButtonProps } from './BaseButton';
import type { DurationString, EasingString } from '~tokens/global';
import type { BorderRadiusValues, BorderWidthValues, SpacingValues } from '~tokens/theme/theme';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { BladeCommonEvents } from '~components/types';
import type { IconProps, IconSize } from '~components/Icons';
import type { BaseSpinnerProps } from '~components/Spinner/BaseSpinner';
import type { Theme } from '~components/BladeProvider';
import type { DataAnalyticsAttribute, DotNotationSpacingStringToken } from '~utils/types';
import type { BaseTextProps } from '~components/Typography/BaseText/types';

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
  defaultBorderColor: string;
  hoverBackgroundColor: string;
  hoverBorderColor: string;
  focusBackgroundColor: string;
  focusBorderColor: string;
  focusRingColor: string;
  motionDuration: DurationString;
  motionEasing: EasingString;
  borderWidth: BorderWidthValues;
  borderRadius: BorderRadiusValues;
  height?: string;
  width?: string;
};

export type StyledBaseButtonProps = Omit<
  BaseButtonProps,
  'icon' | 'children' | 'accessibilityLabel' | keyof DataAnalyticsAttribute
> & {
  defaultBorderColor: string;
  minHeight: `${ButtonMinHeight}px`;
  height?: BaseButtonStyleProps['height'];
  width?: BaseButtonStyleProps['width'];
  buttonPaddingTop: SpacingValues;
  buttonPaddingBottom: SpacingValues;
  buttonPaddingLeft: SpacingValues;
  buttonPaddingRight: SpacingValues;
  children: ReactNode;
  defaultBackgroundColor: string;
  disabled: boolean;
  focusBorderColor: string;
  focusBackgroundColor: string;
  focusRingColor: string;
  hoverBorderColor: string;
  hoverBackgroundColor: string;
  isFullWidth: boolean;
  motionDuration: DurationString;
  motionEasing: EasingString;
  borderWidth: BorderWidthValues;
  borderRadius: BorderRadiusValues;
  accessibilityProps: Record<string, unknown>;
  isPressed: boolean;
} & StyledPropsBlade &
  BladeCommonEvents;

export type AnimatedButtonContentProps = Pick<
  StyledBaseButtonProps,
  'motionDuration' | 'motionEasing' | 'isPressed'
>;
