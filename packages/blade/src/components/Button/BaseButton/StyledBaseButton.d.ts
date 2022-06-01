import type { BaseButtonProps } from './BaseButton';

export type StyledBaseButtonProps = Omit<BaseButtonProps, 'icon' | 'children'> & {
  children: string;
  onClick: () => void;
  color: string;
  hoverColor: string;
  activeColor: string;
  minHeight: '48px' | '40px' | '32px' | '28px';
  spacing: string;
};

export { default } from './StyledBaseButton.web';
