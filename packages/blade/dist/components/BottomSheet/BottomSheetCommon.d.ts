import { default as React } from 'react';
import { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types';
import { BladeElementRef } from '../../utils/types';
type BottomSheetEmptyHeaderProps = Pick<ReactDOMAttributes, 'onClickCapture' | 'onKeyDown' | 'onKeyUp' | 'onLostPointerCapture' | 'onPointerCancel' | 'onPointerDown' | 'onPointerMove' | 'onPointerUp'>;
declare const BottomSheetEmptyHeader: React.ForwardRefExoticComponent<BottomSheetEmptyHeaderProps & React.RefAttributes<BladeElementRef>>;
export { BottomSheetEmptyHeader };
