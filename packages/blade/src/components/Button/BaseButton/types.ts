import type { ReactNode } from 'react';
import type { ButtonMinHeight } from './buttonTokens';
import type { BaseButtonProps } from './BaseButton';
import type { DurationString, EasingString } from '~tokens/global/motion';
import type { BorderRadiusValues, BorderWidthValues, SpacingValues } from '~tokens/theme/theme.d';
import type { StyledProps } from '~components/Box/styled-props';

export type StyledBaseButtonProps = Omit<
  BaseButtonProps,
  'icon' | 'children' | 'accessibilityLabel'
> & {
  activeBorderColor: string;
  activeBackgroundColor: string;
  defaultBorderColor: string;
  minHeight: `${ButtonMinHeight}px`;
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
} & StyledProps;
