/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SnapPoints } from './utils';
import type { ButtonProps } from '~components/Button';

export type BottomSheetProps = {
  children: React.ReactNode;
  snapPoints?: SnapPoints;
  onDismiss?: () => void;
  isOpen?: boolean;
  initialFocusRef?: React.MutableRefObject<any>;
};

export type BottomSheetFooterProps = {
  title: string;
  leading?: React.ReactNode;
  trailing?: {
    primary?: BottomSheetFooterAction;
    secondary?: BottomSheetFooterAction;
  };
};

type BottomSheetFooterAction = Pick<
  ButtonProps,
  'type' | 'accessibilityLabel' | 'isLoading' | 'isDisabled' | 'icon' | 'iconPosition' | 'onClick'
> & {
  text: ButtonProps['children'];
};

export type BottomSheetFooterLeadingProps = {
  title?: string;
  prefix?: React.ReactNode;
};

export type BottomSheetFooterTrailingProps = {
  actions?: {
    primary?: BottomSheetFooterAction;
    secondary?: BottomSheetFooterAction;
  };
  hasLeading: boolean;
};
