import type { Theme } from '../../BladeProvider';
import type { BaseButtonProps } from './BaseButton';
import type { ButtonMinHeight } from './buttonTokens';

export type StyledBaseButtonProps = Omit<BaseButtonProps, 'icon' | 'children'> & {
  activeBorderColor: string;
  activeColor: string;
  defaultBorderColor: string;
  minHeight: `${ButtonMinHeight}px`;
  spacing: `${ValueOf<Theme['spacing']>}px ${ValueOf<Theme['spacing']>}px`;
  children: string;
  defaultColor: string;
  disabled: boolean;
  focusBorderColor: string;
  focusColor: string;
  focusRingColor: string;
  hoverBorderColor: string;
  hoverColor: string;
  isFullWidth: boolean;
  onClick: () => void;
  borderWidth: `${ValueOf<Theme['border']['width']>}px`;
  borderRadius: `${ValueOf<Theme['border']['radius'], 'round'>}px`;
};

export { default } from './StyledBaseButton.web';
