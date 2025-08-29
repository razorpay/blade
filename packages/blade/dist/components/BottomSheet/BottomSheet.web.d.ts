import { default as React } from 'react';
import { BottomSheetHeader } from './BottomSheetHeader';
import { BottomSheetFooter } from './BottomSheetFooter';
import { BottomSheetBody } from './BottomSheetBody';
import { BottomSheetProps } from './types';
export declare const BOTTOM_SHEET_EASING = "cubic-bezier(.15,0,.24,.97)";
declare const BottomSheet: ({ isOpen, onDismiss, children, initialFocusRef, snapPoints, zIndex, ...dataAnalyticsProps }: BottomSheetProps) => React.ReactElement;
export { BottomSheet, BottomSheetBody, BottomSheetHeader, BottomSheetFooter };
export type { BottomSheetProps };
