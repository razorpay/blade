/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SnapPoints } from './utils';
import type { BaseHeaderProps } from '~components/BaseHeaderFooter/BaseHeader';
import type { BaseFooterProps } from '~components/BaseHeaderFooter/BaseFooter';

export type BottomSheetProps = {
  children: React.ReactNode;
  snapPoints?: SnapPoints;
  onDismiss?: () => void;
  isOpen?: boolean;
  initialFocusRef?: React.MutableRefObject<any>;
};

export type BottomSheetHeaderProps = Pick<
  BaseHeaderProps,
  | 'title'
  | 'subtitle'
  | 'leading'
  | 'trailing'
  | 'titleSuffix'
  | 'hideDivider'
  | 'showBackButton'
  | 'onBackButtonClick'
>;

export type BottomSheetFooterProps = Pick<BaseFooterProps, 'children' | 'hideDivider'>;
