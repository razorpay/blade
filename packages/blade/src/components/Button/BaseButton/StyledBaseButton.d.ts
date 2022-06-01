import type { BaseButtonProps } from './BaseButton';
import type { ButtonMinHeight } from './buttonTokens';

export type StyledBaseButtonProps = Omit<BaseButtonProps, 'icon' | 'children'> & {
  activeBorderColor: string;
  activeColor: string;
  borderColor: string;
  minHeight: ButtonMinHeight;
  spacing: string;
  children: string;
  color: string;
  disabled: boolean;
  focusBorderColor: string;
  focusColor: string;
  focusRingColor: string;
  hoverBorderColor: string;
  hoverColor: string;
  isFullWidth: boolean;
  onClick: () => void;
};

export { default } from './StyledBaseButton.web';
