import type { IconComponent } from '~components/Icons';

export type StyledIconButtonProps = {
  icon: IconComponent;
  onClick: () => void;
  size: 'medium' | 'large';
  contrast: 'low' | 'high';
  accessibilityLabel: string;
};
