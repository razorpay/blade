import type { DurationStringTokens, EasingStringTokens } from '../../../tokens/global/motion';
import type { Theme } from '../../BladeProvider';
import type { BaseButtonProps } from './BaseButton';
import type { ButtonMinHeight } from './buttonTokens';

export type StyledBaseButtonProps = Omit<BaseButtonProps, 'icon' | 'children'> & {
  activeBorderColor: string;
  activeBackgroundColor: string;
  defaultBorderColor: string;
  minHeight: `${ButtonMinHeight}px`;
  spacing: `${ValueOf<Theme['spacing']>}px ${ValueOf<Theme['spacing']>}px`;
  children: string;
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
  theme: Theme;
  borderWidth: `${ValueOf<Theme['border']['width']>}px`;
  borderRadius: `${ValueOf<Theme['border']['radius'], 'round'>}px`;
};

export { default } from './StyledBaseButton.web';
