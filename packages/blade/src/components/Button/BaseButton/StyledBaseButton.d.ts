import type { BaseButtonProps } from './BaseButton';

export type StyledBaseButtonProps = Omit<BaseButtonProps, 'icon' | 'children'> & {
  activeBorderColor: string;
  activeColor: string;
  borderColor: string;
  minHeight: '48px' | '40px' | '32px' | '28px';
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
