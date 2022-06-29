import type { ReactNode } from 'react';
import type { DurationStringTokens, EasingStringTokens } from '../../../tokens/global/motion';
import type {
  BorderRadiusValues,
  BorderWidthValues,
  SpacingValues,
} from '../../../tokens/theme/theme.d';
import type { BaseButtonProps } from './BaseButton';
import type { ButtonMinHeight } from './buttonTokens';

export type StyledBaseButtonProps = Omit<BaseButtonProps, 'icon' | 'children'> & {
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
  onClick: () => void;
  motionDuration: DurationStringTokens;
  motionEasing: EasingStringTokens;
  borderWidth: BorderWidthValues;
  borderRadius: BorderRadiusValues;
};

export { default } from './StyledBaseButton.web';
