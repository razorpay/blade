/* eslint-disable react/display-name */
import React from 'react';
import type { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types';
import { useBottomSheetContext } from './BottomSheetContext';
import BaseBox from '~components/Box/BaseBox';
import { IconButton } from '~components/Button/IconButton';
import { CloseIcon } from '~components/Icons';
import type { BladeElementRef } from '~src/hooks/useBladeInnerRef';
import { isReactNative } from '~utils';

type BottomSheetEmptyHeaderProps = Pick<
  ReactDOMAttributes,
  | 'onClickCapture'
  | 'onKeyDown'
  | 'onKeyUp'
  | 'onLostPointerCapture'
  | 'onPointerCancel'
  | 'onPointerDown'
  | 'onPointerMove'
  | 'onPointerUp'
>;

const BottomSheetEmptyHeader = React.forwardRef<BladeElementRef, BottomSheetEmptyHeaderProps>(
  (
    {
      onClickCapture,
      onKeyDown,
      onKeyUp,
      onLostPointerCapture,
      onPointerCancel,
      onPointerDown,
      onPointerMove,
      onPointerUp,
    },
    ref,
  ) => {
    const { close } = useBottomSheetContext();
    return (
      <BaseBox
        position="relative"
        height="24px"
        touchAction="none"
        onClickCapture={onClickCapture}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onLostPointerCapture={onLostPointerCapture}
        onPointerCancel={onPointerCancel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <BaseBox
          position="absolute"
          top={isReactNative() ? 'spacing.0' : 'spacing.5'}
          right="spacing.5"
        >
          <IconButton
            ref={ref}
            size="large"
            icon={CloseIcon}
            accessibilityLabel="Close"
            onClick={close}
          />
        </BaseBox>
      </BaseBox>
    );
  },
);

export { BottomSheetEmptyHeader };
