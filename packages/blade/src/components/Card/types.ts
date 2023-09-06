import type { BaseBoxProps } from '~components/Box/BaseBox';

type CardRootProps = {
  isSelected?: boolean;
  isFocused?: boolean;
  shouldScaleOnHover?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  href?: string;
  as?: 'label';
  accessibilityLabel?: string;
} & BaseBoxProps;

type LinkOverlayProps = {
  href?: string;
} & BaseBoxProps;

export type { CardRootProps, LinkOverlayProps };
