/* eslint-disable @typescript-eslint/no-explicit-any */
import type { BaseHeaderProps } from '../BaseHeaderFooter/BaseHeader';
import type { BaseFooterProps } from '../BaseHeaderFooter/BaseFooter';
import type { SnapPoints } from './utils';

type BottomSheetProps = {
  children: React.ReactNode;
  snapPoints?: SnapPoints;
  onDismiss?: () => void;
  isOpen?: boolean;
  initialFocusRef?: React.MutableRefObject<any>;
};

type BottomSheetHeaderProps = Pick<
  BaseHeaderProps,
  | 'title'
  | 'subtitle'
  | 'leading'
  | 'trailing'
  | 'titleSuffix'
  | 'showDivider'
  | 'showBackButton'
  | 'onBackButtonClick'
>;

type BottomSheetFooterProps = Pick<BaseFooterProps, 'children' | 'showDivider'>;

export { BottomSheetProps, BottomSheetHeaderProps, BottomSheetFooterProps };
