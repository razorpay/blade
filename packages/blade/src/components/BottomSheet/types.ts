/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SnapPoints } from './utils';

export type BottomSheetProps = {
  children: React.ReactNode;
  snapPoints?: SnapPoints;
  onDismiss?: () => void;
  isOpen?: boolean;
  initialFocusRef?: React.MutableRefObject<any>;
};
