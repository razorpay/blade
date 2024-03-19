import type { ReactNode } from 'react';
import type { ButtonMinHeight } from './buttonTokens';
import type { BaseButtonProps } from './BaseButton';
import type { DurationString, EasingString } from '~tokens/global';
import type { BorderRadiusValues, BorderWidthValues, SpacingValues } from '~tokens/theme/theme';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { BladeCommonEvents } from '~components/types';

export type StyledBaseButtonProps = Omit<
  BaseButtonProps,
  'icon' | 'children' | 'accessibilityLabel'
> & {
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
  isPressed: boolean;
} & StyledPropsBlade &
  BladeCommonEvents;

export type AnimatedButtonContentProps = Pick<
  StyledBaseButtonProps,
  'motionDuration' | 'motionEasing' | 'isPressed'
>;
